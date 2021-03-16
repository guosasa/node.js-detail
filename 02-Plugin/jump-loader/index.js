const loaderUtils = require('loader-utils')
const path = require('path')
const fs = require('fs')

function logIt(text) {
    console.log('\033[41;37m ' + text + ' \033[0m');
}

let insertStr = (soure, start, newStr) => {
    return soure.slice(0, start) + newStr + soure.slice(start)
}

// 共有规则
let commonRule1 = `if (/\\\\?from=(mobile|desktop)/g.test(location.href)) {}`

function insertPCjump(ua, ignoreType) {
    let script =
        `<script>${commonRule1} else if (/${ua}/i.test(navigator.userAgent.toLowerCase())) {
        location.href = (location.origin + location.pathname).replace(/\\\\/?(\\\\w+\\\\.html)?$/, '/mh/$1') + location.search + location.hash
    } else {
        if (/iphone|ios|android|mobile/i.test(navigator.userAgent.toLowerCase())) {
            location.href = (location.origin + location.pathname).replace(/\\\\/?(\\\\w+\\\\.html)?$/, '/m/$1') + location.search + location.hash
        }
    }
  </script>`

    if (ignoreType === 2) {
        script =
            `<script>${commonRule1} else if(/iphone|ios|android|mobile/i.test(navigator.userAgent.toLowerCase())) {
        location.href = (location.origin + location.pathname).replace(/\\\\/?(\\\\w+\\\\.html)?$/, '/m/$1') + location.search + location.hash
      }
      </script>`
    }

    if (ignoreType === 1) {
        script =
            `<script>${commonRule1} else if(/iphone|ios|android|mobile/i.test(navigator.userAgent.toLowerCase())) {
        location.href = (location.origin + location.pathname).replace(/\\\\/?(\\\\w+\\\\.html)?$/, '/mh/$1') + location.search + location.hash
      }
      </script>`
    }

    return script
}

function insertMjump(ua, ignoreType) {
    let script =
        `<script>${commonRule1} else if (/${ua}/i.test(navigator.userAgent.toLowerCase())) {
      location.href = ( location.origin + location.pathname ).replace(/(\\\\/m\\\\/|\\\\/m$)/g, '/mh/') + location.search + location.hash
    } else {
      if (!/iphone|ios|android|mobile/i.test(navigator.userAgent.toLowerCase())) {
        location.href = ( location.origin + location.pathname ).replace(/(\\\\/m\\\\/|\\\\/m$)/g, '/') + location.search + location.hash
      }
    }
  </script>`

    // 2in1 
    if (ignoreType === 0) {
        script =
            `<script>${commonRule1} else if (/${ua}/i.test(navigator.userAgent.toLowerCase())) {
        location.href = ( location.origin + location.pathname ).replace(/(\\\\/m\\\\/|\\\\/m$)/g, '/mh/') + location.search + location.hash
      }
      </script>`
    } else if (ignoreType === 2) {
        script =
            `<script>${commonRule1} else if (!/iphone|ios|android|mobile/i.test(navigator.userAgent.toLowerCase())) {
        location.href = ( location.origin + location.pathname ).replace(/(\\\\/m\\\\/|\\\\/m$)/g, '/') + location.search + location.hash
      }
      </script>`
    }
    return script
}

function insertMHjump(ua, ignoreType) {

    let script =
        `<script>
        let lua = navigator.userAgent.toLowerCase()
        ${commonRule1} else if ( !/${ua}/i.test(lua) && (!/macintosh/i.test(lua) || /chrome|safari/i.test(lua)) ) {
          if (!/iphone|ios|android|mobile/i.test(lua) ) {
            location.href = (location.origin + location.pathname).replace(/(\\\\/mh\\\\/|\\\\/mh$)/g, '/') + location.search + location.hash
          } else {
            location.href = (location.origin + location.pathname).replace(/(\\\\/mh\\\\/|\\\\/mh$)/g, '/m/') + location.search + location.hash
          }
      } 
    </script>`

    // 2in1 
    if (ignoreType === 0) {
        script =
            `<script>
        let lua = navigator.userAgent.toLowerCase()
        ${commonRule1} else if ( !/${ua}/i.test(lua) && (!/macintosh/i.test(lua) || /chrome|safari/i.test(lua)) ) {
          location.href = ( location.origin + location.pathname ).replace(/(\\\\/mh\\\\/|\\\\/mh$)/g, '/m/') +  location.search + location.hash
        } 
      </script>`
    } else if (ignoreType === 1) {
        script =
            `<script>
        let lua = navigator.userAgent.toLowerCase()
        ${commonRule1} else if ( !/iphone|ios|android|mobile/i.test(lua) && ( !/macintosh/i.test(lua) || /chrome|safari/i.test(lua) ) ) {
          location.href = ( location.origin + location.pathname ).replace(/(\\\\/mh\\\\/|\\\\/mh$)/g, '/') + location.search + location.hash
        }
      </script>`
    }

    return script
}

function insertCustomjump(entryType, rules) {
    let script = '<script>\n'

    for (let r = 0; r < rules.length; r++) {
        let curRule = rules[r]
        let realTo = '/' + curRule.to
        if (curRule.to === 'pc') {
            realTo = ''
        }
        if (curRule.from === entryType) {
            let jumpCode = `location.href = ( location.origin + location.pathname ).replace(/\\\\/${curRule.from}\\\\/?(\\\\w+\\\\.html)?$/g, '${realTo}/$1') + location.search + location.hash`
            if (curRule.from === 'pc') {
                jumpCode = `location.href = ( location.origin + location.pathname ) + '${curRule.to}/' + location.search + location.hash`
            }
            if (curRule.to.indexOf("http") === -1) { // 非自定义
                // 判断是否
                let opposite = curRule.ua[0] === '!'
                if (opposite) {
                    script += `if (!/${curRule.ua.substring(1, curRule.ua.length)}/i.test(navigator.userAgent.toLowerCase())) {
            ${jumpCode}
          }\n`
                } else {
                    script += `if (/${curRule.ua}/i.test(navigator.userAgent.toLowerCase())) {
            ${jumpCode}
          }\n`
                }
            } else {
                // 判断是否
                let opposite = curRule.ua[0] === '!'
                if (opposite) {
                    script += `if (!/${curRule.ua.substring(1, curRule.ua.length)}/i.test(navigator.userAgent.toLowerCase())) {
            location.href = "${curRule.to}"
          }\n`
                } else {
                    script += `if (/${curRule.ua}/i.test(navigator.userAgent.toLowerCase())) {
            location.href = "${curRule.to}"
          }\n`
                }
            }
        }
    }

    return script + '</script>'
}

function startInsertJumpCode(content, script) {

    // 直接插入到入口HTML中的head中 
    let reg = /<\/head>/g
    let res = reg.exec(content)
    return insertStr(content, res.index, script)

}

function getEntryType(entry, type) {
    let entryReg = /client(.*)$/g.exec(entry)
    let entryType = 'other'
    if (entryReg) {
        if (!entryReg[1]) {
            entryType = 'pc'
        } else if (/m$/g.test(entryReg[1])) {
            entryType = 'm'
        } else if (/mh$/g.test(entryReg[1])) {
            entryType = 'mh'
        } else {
            // 到这一步就是错误的入口了
            if (type === '3in1' || type === "2in1") {
                // logIt(`错误的入口地址:${entry}，请检查client文件夹的结构!`)
                // 默认是PC的
                entryType = 'pc'
            } else {
                // 自定义目录
                let res = /\w+$/g.exec(entryReg[1])
                if (res) {
                    entryType = res[0]
                } else {
                    logIt(`错误的入口地址:${entry}，请检查client文件夹的结构!`)
                }
            }
        }
    }
    return entryType
}

function convertHttps(script) {
    let httpsCode = `
  if( /^http\\\\:/.test( location.href ) ) {
    location.href = location.href.replace(/^http\\\\:/, 'https:')
  }`
    return insertStr(script, 8, httpsCode);
}

module.exports = function(content) {
    // 判断是本地环境么
    const __DEBUG = /start/g.test(process.env.npm_config_argv)
    // 判断是正式环境么
    const __PRODUCT = /release/g.test(process.env.npm_config_argv)
    const conf = loaderUtils.getOptions(this) || {}
    const type = conf.type || '3in1'
    const ua = conf.ua || 'l12webview|l10webview|nshwebview'
    const removeLocalUAJump = conf.removeLocalUAJump || false
    // 2in1的入口。默认pc和m
    const twoin1entry = conf.entry || [0, 1]
    // 获取入口
    const entry = this._module.context

    let entryType = getEntryType(entry, type)
    if (entryType === 'other') { // 过滤没用的入口
        return content;
    }

    if (type === '3in1' || type === '2in1') { // 3合1模板
        let script = ''
        let ignoreType = -1
        if (type === '2in1') {
            ignoreType = [0, 1, 2].filter(val => val !== twoin1entry[0] && val !== twoin1entry[1])[0]
        }
        if (entryType === 'pc') {
            script = insertPCjump(ua, ignoreType)
        } else if (entryType === 'm') {
            script = insertMjump(ua, ignoreType)
        } else if (entryType === 'mh') {
            // 本地模式就不管ua了
            if (!removeLocalUAJump || !__DEBUG) {
                script = insertMHjump(ua, ignoreType)
            }
        }
        // 最终处理，正式环境把非https跳转强制修改为https
        if (__PRODUCT) {
            script = convertHttps(script)
        }
        content = startInsertJumpCode(content, script);
    }

    if (type === 'custom') {
        let customRules = conf.customRules
        if (!customRules) {
            logIt(`缺失自定义的规则！请配置customRules！`)
            return content;
        } else {
            let script = ''
            script = insertCustomjump(entryType, customRules)
            // 最终处理，正式环境把非https跳转强制修改为https
            if (__PRODUCT) {
                script = convertHttps(script)
            }
            content = startInsertJumpCode(content, script)
        }
    }


    logIt('----------------jump-loader(1.2.0)-end----------------')

    return content;
}
