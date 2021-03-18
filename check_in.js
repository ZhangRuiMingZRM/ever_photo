const request = require('request'),
    login_url = "https://web.everphoto.cn/api/auth",
    check_in_url = "https://api.everphoto.cn/users/self/checkin/v2",
    config = {
        'dingtalk': {
            'access_token': get_environment_var('DINGTALK_ACCESS_TOKEN'),
            'secret': get_environment_var('DINGTALK_SECRET')
        },
        'ever_photo': {
            'mobile': get_environment_var('EVER_PHOTO_MOBILE'),
            'password': get_environment_var('EVER_PHOTO_PASSWORD')
        }
    };

function get_environment_var(name) {
    if (process.env.hasOwnProperty(name)) {
        return process.env[name];
    }
    return '';
}


function dingtalk_notice(message) {

    if (null === get_environment_var('DINGTALK_ACCESS_TOKEN')) {
        return;
    }

    let crypto = require('crypto');
    let timestamp = Date.now();

    let sign = crypto.createHmac('sha256', config.dingtalk.secret).update(timestamp + '\n' + config.dingtalk.secret).digest('base64');

    let webhook_url = 'https://oapi.dingtalk.com/robot/send?access_token=' + config.dingtalk.access_token + '&timestamp=' + timestamp + '&sign=' + sign;

    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }

    let option = {
        'url': webhook_url, 'headers': {'Content-Type': 'application/json;charset=utf-8'}, 'json': {
            'msgtype': 'text',
            'text': {
                'content': message
            }
        }
    }

    request.post(option, (error, response) => {
        if (error || 0 !== response.body.errcode) throw new Error('Send dingtalk message fail !');
        console.log(response.body);
    });
}

dingtalk_notice('start checkin');

request.post(
    {
        'url': login_url,
        'headers': {},
        formData: {'mobile': config.ever_photo.mobile, 'password': config.ever_photo.password}
    },
    (error, response) => {
        if (error || 0 !== JSON.parse(response.body).code) {
            throw new Error('Ever photo login failed !');
        }
        request.post(
            {'url': check_in_url, headers: {'authorization': 'Bearer ' + JSON.parse(response.body).data.token}},
            (error, response) => {
                if (error || true !== JSON.parse(response.body).data.checkin_result) {
                    throw new Error('Check in failed !');
                }
                let reward_info = JSON.parse(response.body).data;
                dingtalk_notice('签到完成！已经连续签到' + reward_info.continuity + '天，签到总共获得' + reward_info.total_reward / 1048576 + 'M。');
            });
    });


process.on('uncaughtException', (e) => {
    dingtalk_notice(e.message);
});


