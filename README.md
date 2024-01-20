## statement2mcfunction

一个将编程化的语句转译为 Minecraft 命令的工具

> **Note**
> 摆了，没多大前景
> - Script API 是更好的选择
> - 基岩版 mcfunction 有运行行数限制，而且东西很少（比如 return 命令等都没有），记分板、execute 什么的都没 Java 版那么强大，导致很多功能实现不了
> - 个人能力所限，转译什么的对我来说还是太超前了，而且目标还是 mcfunction 这样一个特殊的环境

> 如果有大佬从我这找了灵感并作出了更完整的东西，可以@我，我去给 star

```
# 声明路径地址
# 只能使用绝对路径
# 非必要，默认为 (/scripts)/index.mcfunction 文件
#! path <path>
# e.g.
#     (nothing)    # -> /index.mcfunction
#     #! path /         # -> /index.mcfunction
#     #! path /main     # -> /main.mcfunction
#     #! path /main/    # -> /main/index.mcfunction

# 从记分板获得参数
# 默认记分板为 e2mf_main
get <parameter> [from <objective>]
# e.g.
#     get a from test
#     get b from test

# 声明变量（赋值）
<variable> <assignmentOperator> <expression>
# assignmentOperator: 与其在记分板的 operation 命令中表现一致
#     =
#     +=
#     -=
#     *=
#     /=
#     %=
#     <
#     >
# expression:
#     - 其他变量，比如 a
#     - 数字，只能是整数，比如 12
#     - 计算式
# e.g.
#     c = a
#     d = 16 / c

# 计算式：
<variable> <arithmeticOperator> <variable|integer>
# arithmeticOperator:
#     a + b
#     a - b
#     a * b
#     a / b
#     a % b
#     a ** 4 : 目前幂只能是数字，而不能是变量
#     a < b : 结果是 a b 中较小的值
#     a > b ： 结果是 a b 中较大的值
# 混合运算时需自行用括号两两结合，如 ((a-(b*c))+(d%e))/f

# 储存结果
# 默认储存名称为该变量或参数的名称
store <variable> [to <objective> [as <displayName>]]
# e.g.
#     store c to test
#     store c to test as result

# 执行命令
run <command>
# e.g.
#     run say "Hello World!"

# 打印日志
# log <parameter|variable>
# 使用 tellraw 在游戏中输出指定变量的值
# e.g.
#     log a

# =============== Unimplemented =====================

# 条件循环
while (<condition>) {
    # 其他语句
    # 编译后会单独开另外一个文件
    # 如果条件满足，则用 function 命令运行该文件
    # 在此文件中，最后一行处再次判断条件是否满足，若满足再次执行此文件
}
# condition：where a and b can be parameter, variable or integer
#     a  # -> a != 0
#     a = b
#     a != b  # -> unless a = b
#     a > b
#     a >= b
#     a < b
#     a <= b
# 
# e.g.
#     

# 条件判断
if|unless (<condition>) {
    # 其他语句
    # 编译后会单独开另外一个文件
    # 如果条件满足，则用 function 命令运行该文件
} [else {
    # ...
}]
# else 中的内容会被理解为与上面相反的判断，即以下写法等效
# 
# | if|unless (a = b) { |         | if|unless (a = b) { |
# |     # ...           |         |     # ...           |
# | } else {            |   ===   | }                   |
# |     # ...           |   ===   | unless|if (a = b) { |
# | }                   |         |     # ...           |
# |                     |         | }                   |
# 
# e.g.
#     

# if|unless|for 中的代码块
# 如有必要，可重新声明路径，默认在以该文件名为为名的文件夹下，名称为 e2mf_{id}.mcfunction
# 新的路径可以使用相对路径，以该文件顶层声明的路径所在文件夹为基准

# 定义函数
fun <functionName>([arg1 [arg2 [... argN]]]) {
    
}
# 涉及形参实参和定义域的问题，不好做，暂时咕了

# 运行函数
call <functionName>([arg1 [arg2 [... argN]]])
# 咕

```

### Limited Tests

```js
import main from "./src/main.js"

console.log("Env:", process?.env?.NODE_ENV, "\n")

console.log(main(`

get a from test
get b from test
get c from test
get d from test
get e from test
get f from test
get g from test
get h from test

run say =================

let v = ( ( a - ( b * c ) ) + ( d % e ) ) / ( f / ( g ++ ) )

# let v = ++a

# v += ( a ** 4 ) + b

run say =================

log v

store v as result to test

`)._exportContent())
```


下面的目前并不能转译


```
e.g. fibonacci number

#! path /fibonacci

get n from fibonacci

currentValue = 1
previousValue = 0

if (n = 1) {
    call say(n, currentValue)
}

iterationsCounter = n - 1

while (iterationsCounter) {
    currentValue += previousValue
    previousValue = currentValue - previousValue
    iterationsCounter -= 1
}

call say(n, currentValue)

function say(n, currentValue) {
    run say "Fibonacci number of ${n} is ${currentValue}"
    store currentValue to fibonacci as result
}


```


```
e.g. fibonacci number

#! path /fibonacci

get n from fibonacci

currentValue = 1
previousValue = 0

iterationsCounter = n - 1

while iterationsCounter
    currentValue += previousValue
    previousValue = currentValue - previousValue
    iterationsCounter -= 1
endwhile

store currentValue to fibonacci as result


```
