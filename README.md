# ever_photo

### 使用Github Actions 实现时光相册自动签到

#使用方法
1. 右上角fork本仓库
2. 点击Settings -> Secrets -> 点击绿色按钮 (如无绿色按钮说明已激活。直接到第三步。)
3. 新增 new secret 并设置 Secrets:
4. **必须** - 请随便找个文件(例如`README.md`)，加个空格提交一下，否则可能会出现无法定时执行的问题

#### Secrets 变量设置说明

| 名称                  | 说明                           |
| --------------------- | ------------------------------ |
| EVER_PHOTO_MOBILE     | 时光相册用户账号 **必须**      |
| EVER_PHOTO_PASSWORD   | 时光相册用户密码 **必须**      |
| DINGTALK_ACCESS_TOKEN | 钉钉推送access_token（非必须） |
| DINGTALK_SECRET       | 钉钉推送secret（非必须）       |



#### 如何获取时光相册登录账号密码

- ##### WEB
