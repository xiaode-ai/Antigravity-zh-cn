$jsonPath = "c:\Users\i-cgh\.gemini\antigravity-ide\scratch\Antigravity-zh-cn\translations.json"
$translations = Get-Content -Raw -Path $jsonPath | ConvertFrom-Json
Write-Host "Original translations: $($translations.Count)"

$newEntries = @(
    [PSCustomObject]@{ old = 'title:"Learn more"'; new = 'title:"了解更多"' },
    [PSCustomObject]@{ old = 'children:"Learn more"'; new = 'children:"了解更多"' },
    [PSCustomObject]@{ old = 'children:F??"Learn more"'; new = 'children:F??"了解更多"' },
    [PSCustomObject]@{ old = 'children:"Learn more."'; new = 'children:"了解更多。"' },
    [PSCustomObject]@{ old = '"Learn more about"'; new = '"了解更多关于"' },
    [PSCustomObject]@{ old = '"Please verify your account, then sign in again to continue. Learn more by visiting our"'; new = '"请验证您的账户，然后重新登录以继续。了解更多信息请访问我们的"' },
    [PSCustomObject]@{ old = '"Learn more by visiting our"'; new = '"了解更多信息请访问我们的"' },
    [PSCustomObject]@{ old = '". Learn more about skills at"'; new = '"。了解更多关于技能的信息，请访问"' },

    [PSCustomObject]@{ old = 'Ju.DENY?"Deny"'; new = 'Ju.DENY?"拒绝"' },
    [PSCustomObject]@{ old = 'et===Ju.ALLOW?"Allow":et===Ju.DENY?"Deny":"Always Ask"'; new = 'et===Ju.ALLOW?"允许":et===Ju.DENY?"拒绝":"总是询问"' },
    [PSCustomObject]@{ old = 'it===Ju.ALLOW?"Allow":it===Ju.DENY?"Deny":"Always Ask"'; new = 'it===Ju.ALLOW?"允许":it===Ju.DENY?"拒绝":"总是询问"' },
    [PSCustomObject]@{ old = 'label:"Deny",onClick:()=>t()'; new = 'label:"拒绝",onClick:()=>t()' },
    [PSCustomObject]@{ old = 'label:"Deny",onClick:F'; new = 'label:"拒绝",onClick:F' },
    [PSCustomObject]@{ old = 'children:"Deny"'; new = 'children:"拒绝"' },
    [PSCustomObject]@{ old = '"aria-label":"Deny setting up browser"'; new = '"aria-label":"拒绝设置浏览器"' },
    [PSCustomObject]@{ old = 'label:"Deny List Terminal Commands",description:"Agent asks for permission'; new = 'label:"终端命令黑名单",description:"智能体在执行黑名单条目匹配的命令前会请求许可' },
    [PSCustomObject]@{ old = '" (except those in the Deny list)."'; new = '"（在黑名单中的除外）。"' },

    [PSCustomObject]@{ old = 'rightElement:p(lo,{onClick:()=>{re("file")},children:"Open"})'; new = 'rightElement:p(lo,{onClick:()=>{re("file")},children:"打开"})' },
    [PSCustomObject]@{ old = 'rightElement:p(lo,{onClick:()=>{re("network")},children:"Open"})'; new = 'rightElement:p(lo,{onClick:()=>{re("network")},children:"打开"})' },
    [PSCustomObject]@{ old = 'rightElement:p(lo,{onClick:()=>{re("command")},children:"Open"})'; new = 'rightElement:p(lo,{onClick:()=>{re("command")},children:"打开"})' },
    [PSCustomObject]@{ old = 'rightElement:p(lo,{onClick:()=>{re("unsandboxed")},children:"Open"})'; new = 'rightElement:p(lo,{onClick:()=>{re("unsandboxed")},children:"打开"})' },
    [PSCustomObject]@{ old = 'rightElement:p(lo,{onClick:()=>{re("mcp")},children:"Open"})'; new = 'rightElement:p(lo,{onClick:()=>{re("mcp")},children:"打开"})' },
    [PSCustomObject]@{ old = 'children:[p("span",{children:"Open"}),p(qe,{name:"zoom_out_map"'; new = 'children:[p("span",{children:"打开"}),p(qe,{name:"zoom_out_map"' },

    [PSCustomObject]@{ old = 'rightElement:p(lo,{onClick:()=>{N(!0)},children:"Add"})'; new = 'rightElement:p(lo,{onClick:()=>{N(!0)},children:"添加"})' },
    [PSCustomObject]@{ old = 'children:[p(qe,{name:"add",className:"h-3 w-3"}),p("div",{children:"Add"})]'; new = 'children:[p(qe,{name:"add",className:"h-3 w-3"}),p("div",{children:"添加"})]' },
    [PSCustomObject]@{ old = 'p(Eo,{onClick:x,className:"px-4 py-2 text-sm",children:"Add"})'; new = 'p(Eo,{onClick:x,className:"px-4 py-2 text-sm",children:"添加"})' },
    [PSCustomObject]@{ old = 'p(lo,{onClick:()=>d(!0),children:"Add"})'; new = 'p(lo,{onClick:()=>d(!0),children:"添加"})' },

    [PSCustomObject]@{ old = 'rightElement:p(lo,{onClick:()=>{u("execute_url")},children:"Edit"})'; new = 'rightElement:p(lo,{onClick:()=>{u("execute_url")},children:"编辑"})' },
    [PSCustomObject]@{ old = 'bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors",children:"Edit"}'; new = 'bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors",children:"编辑"}' },
    [PSCustomObject]@{ old = 'label:"Edit",icon:"edit"'; new = 'label:"编辑",icon:"edit"' },

    [PSCustomObject]@{ old = 'children:"Delete Project"'; new = 'children:"删除项目"' },
    [PSCustomObject]@{ old = 'label:"Delete Project"'; new = 'label:"删除项目"' },
    [PSCustomObject]@{ old = '"Permanently delete this project and all of its conversations."'; new = '"永久删除此项目及其所有对话。"' },

    [PSCustomObject]@{ old = 'title:"Close Settings",children:"\u2715"'; new = 'title:"关闭设置",children:"\u2715"' },
    [PSCustomObject]@{ old = 'children:p("span",{children:"Cancel task"})'; new = 'children:p("span",{children:"取消任务"})' }
)

$list = New-Object System.Collections.Generic.List[Object]
foreach ($t in $translations) {
    $list.Add($t)
}

$addedCount = 0
foreach ($entry in $newEntries) {
    $exists = $false
    foreach ($t in $list) {
        if ($t.old -eq $entry.old) {
            $exists = $true
            break
        }
    }
    if (-not $exists) {
        $list.Add($entry)
        $addedCount++
    }
}

Write-Host "Added $addedCount new unique translations. Total: $($list.Count)"

$json = $list | ConvertTo-Json -Depth 100
[System.IO.File]::WriteAllText($jsonPath, $json)
Write-Host "Successfully written translations.json!"
