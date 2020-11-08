const select = document.querySelector('select')
const btnGenerate = document.querySelector('input[type="submit"]')
const corTarget = document.querySelector('input[type="number"]')



select.addEventListener('change',(e)=>{createForm(e.target.value)})
btnGenerate.addEventListener('click',(e)=>{
    e.preventDefault()

    const formCX = document.querySelectorAll('[data-corX="x"')
    const formCY = document.querySelectorAll('[data-corY="y"')
    const ary = []

    for(let i = 0; i < formCY.length;i++){
        if(i == formCY.length - 1){
            ary.push(corTarget.value.length > 0)
        }
        ary.push(formCX[i].value.length > 0)
        ary.push(formCY[i].value.length > 0)
    }

    const reduce = ary.reduce((prev,next)=>{return prev && next})
    
    if(reduce){
        e.target.disabled = false
        generatePoli()
    }else{
        alert('Chronus-A01 : Please Fill all form')
        e.target.disabled = false
    }
})



function createForm(n){
    const container = document.querySelector('.initial-co')
    let template =''

    for(let i=0; i< n; i++){
        template += `<div class="from-init">
        <input type="number" name="" id="" data-corX="x" placeholder="Coordinate X${i+1}" required>
        <input type="number" name="" id="" data-corY="y" placeholder="Coordinate Y${i+1}" required>
    </div>`
    }

    return container.innerHTML = template
}


function generatePoli(){
    const formCX = document.querySelectorAll('[data-corX="x"')
    const formCY = document.querySelectorAll('[data-corY="y"')

    const interPolation ={
        xTarget :  corTarget.value,
        langkah: formCY.length -1,
        logResult:[],
    }

    const {langkah , logResult } = interPolation
    let z = 0;
    for(let i = 1 ; i <= langkah; i++){
        if(i === 1){
            const value = []
            for(let u = i ; u <= langkah; u++){
                let calculate = parseFloat((formCY[u-1].value-formCY[u].value) / (formCX[u-1].value - formCX[u].value)) 
                value.push(calculate.toString().length < 8 ? calculate : calculate.toFixed(6))
            }
            logResult.push(value)
        }
        else{
           const value = []
           let y = 0;

           for(let a = 1; a <= langkah - (i - 1); a++ ){
              let calculate = parseFloat((logResult[z][y] - logResult[z][y+1]) / (formCX[y].value - formCX[(a+i)-1].value))
              value.push(calculate.toString().length < 8 ? calculate : calculate.toFixed(6))
              y++
           }
           z++
           logResult.push(value)
        }
    }
    subtitution(interPolation)
}


function subtitution(finalOperation){
    const formCX = document.querySelectorAll('[data-corX="x"')
    const A0 = document.querySelectorAll('[data-corY="y"')[0].value

    const { xTarget , logResult} = finalOperation
    const subtiens = [parseInt(A0)]

    for(let i = 0 ; i <= logResult.length; i++){
        if(i !== 0){
            let a = logResult[i-1][0]
            for(let x = 0; x < i;x++){
                a *= xTarget - formCX[x].value
            }
            subtiens.push(a)
        }
    }
    
    return resultCard(finalOperation,subtiens.reduce((prev,next)=>{return prev + next}))
}


function resultCard(finalOperation,subResult){
    const containerResult = document.querySelector('.interpolation-result')
    const { xTarget ,langkah, logResult} = finalOperation

    let rows = ''
    let i = 0
    for(let x = -1; x < logResult.length; x++){
        if(x >=0){
            let a = 0;
            rows += `<tr>
            ${
                logResult[i].map(()=>{
                    return `<td  ${i === 0 ? 'style=color:red;font-weight:bold;':false}>${logResult[a++][i]}</td>`
                }).join('')
            }
            </tr>`
            i++
        }
        else{
            rows += `<tr>
                ${
                    logResult.map((a,b)=>{
                        return `<td>Diff ${b+1}</td>`
                    }).join('')
                }
            </tr>`
        }
    }

    const result =  `   <div class="result-area">
                            <span class="title-result"><i class="fas fa-subscript"></i> Interpolation</span>
                            <span class="j-langkah">Jumlah Langkah : ${langkah}</span>
                            <div class="legend"><div class="toggle-a"></div>Label of A<sub>1</sub> - A<sub>${logResult.length}</sub></div>
                            <table>
                                ${rows}
                            </table>
                            <span class="sub-result">Subtitution Result : ${subResult.toString().length < 8 ? subResult : subResult.toFixed(4)}</span>
                            <button>Close</button>
                        </div>`

    containerResult.id = 'show'
    containerResult.innerHTML = result

    const btn = document.querySelector('button')
    btn.addEventListener('click',()=>{
        window.location.reload()
    })
}   

