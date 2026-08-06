import{readdirSync,readFileSync}from"node:fs";import{extname,join,relative}from"node:path";import{fileURLToPath}from"node:url";
const root=fileURLToPath(new URL("../src/",import.meta.url));
const banned=[[/\bfetch\s*\(/,"network fetch"],[/axios|socket\.io-client|@supabase|mysql2?|express\b/i,"backend dependency"],[/NEXT_PUBLIC_(?:API|SOCKET|SUPABASE|DATABASE)/,"backend environment variable"],[/from\s+["'][^"']*services\/api["']/,"API service import"]];
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(join(dir,entry.name)):[join(dir,entry.name)])}
const violations=[];for(const file of files(root).filter(file=>[".js",".jsx",".ts",".tsx"].includes(extname(file)))){const source=readFileSync(file,"utf8");for(const[pattern,label]of banned)if(pattern.test(source))violations.push(`${relative(root,file)}: ${label}`)}
if(violations.length){console.error(`Frontend boundary violations:\n${violations.map(item=>`- ${item}`).join("\n")}`);process.exit(1)}
console.log(JSON.stringify({status:"ok",scope:"frontend-only",filesScanned:files(root).length},null,2));
