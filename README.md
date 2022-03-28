## Console NFT 刷号脚本

1. 安装node和git，要求nodejs版本不低于12.16.0 (也可以不安装git, 直接下载zip文件获取源码)

2. 从github上复制代码

  ```
  git clone git@github.com:waxcloud2021/discord.git
  ```

3. 进入源码所在目录，安装运行脚本需要的依赖包

  ```
  npm install
  ```

4. 编辑console.js文件，配置好使用代理的端口号（科学上网）

  ```
  proxy: "http://127.0.0.1:7890",
  ```

  端口号7890按实际修改

5. 如果没有使用代理，跳过第4步，代码中做一下切换(两处)

  ```
  require("request").get(options, function (error, response, body) {
  // requestProxy.get(options, function (error, response, body) {
  ```

  ```
  require("request").post(options, function (error, response, body) {
  // requestProxy.post(options, function (error, response, body) {
  ```

6. 用浏览器打开 https://discord.com/login 用你的discord帐号登录，登录成功后在你的主页里选中Console，这时浏览器的URL会显示 https://discord.com/channels/@me/xxxxxxxxxxxxxxxxxx (18位数字)，记下这18位数字(channel id)
 
![Home](https://github.com/minasang211/console/blob/master/home.png)

  (在主页里添加Console步骤略)

7. 编辑console.txt文件, 加入1行
  ```
  帐号1|密码1|上面的18位数字
  ```
  如果想在命令行指定帐号密码, 密码1处替换成*

8. 重复6、7步，添加多个discord帐号，最终生成一个完整的console.txt文件，此操作只需做一次。完整的console.txt会是这样：
  
  ```
  email1@gmail.com|password1|111111111111111111
  email2@gmail.com|password2|222222222222222222
  email3@gmail.com|password3|333333333333333333
  email4@gmail.com|password4|444444444444444444
  email5@gmail.com|password5|555555555555555555
  email6@gmail.com|password6|666666666666666666
  email7@gmail.com|password7|777777777777777777
  email8@gmail.com|password8|888888888888888888
  ......
  ```

9. 用和步骤6同一台电脑同一个IP运行脚本(避免脚本登录时出现captcha required错误)

  ```
  node console.js 帐号密码或- 破解密语
  ```
  脚本依次登录console.txt文件里帐号并向Console发送密语以获得积分. 

  多个密语用空格分开，前后加引号，例子：node console.js - "/browser_hacker /error /clean_scripts /good_gateway"
  
10. 如果脚本在登录某账号时出现captcha required错误，目前没有好的解决方案，需要人工多次登录，直到discord不再要求captcha验证(?)

11. 刷号可能导致Discord帐号被封，谨慎使用本脚本
