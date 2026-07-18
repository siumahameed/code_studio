import{n as e}from"./index-wp575H6p.js";var t=null,n=null,r=[],i=[];async function a(){if(!t)return n||(n=(async()=>{let n=document.createElement(`script`);n.src=e,document.head.appendChild(n),await new Promise((e,t)=>{n.onload=()=>e(),n.onerror=()=>t(Error(`Failed to load Pyodide`))});let a=window.loadPyodide;t=await a({indexURL:`https://cdn.jsdelivr.net/pyodide/v0.27.4/full/`,stdout:e=>{r.push(e)},stderr:e=>{i.push(e)}})})().catch(()=>{t=null,n=null}),n)}function o(){t&&t.runPython(`
import js as _js
def _cs_input(prompt_text=""):
    result = _js.prompt(prompt_text or "")
    return result if result is not None else ""
import builtins
builtins.input = _cs_input
  `)}async function s(e){try{if(await a(),!t)throw Error(`Pyodide failed to initialize`);o();let n=[],s=[];r=[],i=[];try{let i=await t.runPythonAsync(e);if(r.length>0&&n.push(...r),i!=null){let e=!1;if(typeof i==`object`&&`type`in i&&i.type===`NoneType`&&(e=!0),!e){let e=``;if(typeof i==`object`&&`toJs`in i&&typeof i.toJs==`function`){try{let t=i.toJs();e=typeof t==`object`?JSON.stringify(t):String(t)}catch{e=String(i)}try{i.destroy()}catch{}}else e=String(i);e!==`None`&&e!==`undefined`&&e.trim()!==``&&n.push(e)}}}catch(e){s.push(String(e))}return i.length>0&&s.push(...i),{stdout:n.join(`
`),stderr:s.join(`
`),error:null}}catch(e){return{stdout:``,stderr:``,error:`Python runtime error: ${e}`}}}export{s as runPython};