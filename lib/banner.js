import { trimString } from "./util.js"

export const banner = path => trimString(`
# ${path}.mcfunction
# 
# This file is generated using expression2mcfunction.
# 
# expression2mcfunction <https://github.com/PFiS1737/expression2mcfunction>
# Copyright 2022-${new Date().getFullYear()} PFiS1737
# Licensed under MIT
# 
# You are not allowed to delete this block of comment, EVEN IF YOU MODIFY THIS FILE.
# Instead, you can use other comments to indicate what you have modified.
`)