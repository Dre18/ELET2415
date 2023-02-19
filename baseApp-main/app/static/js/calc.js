window.addEventListener('load',()=>{

    console.log("calc page loaded");
    // Add your JS code below
    // GET REQUEST 
    async function catchSum()
    {
        const URL = `/sum?number1=${sum[0].value}&number2=${sum[1].value}`; 
    const response = await fetch(URL); 
    if(response.ok)
    { 
        let res = await response.text(); 
        console.log(res); 
    } 


   
    }
    
    // POST REQUEST 
    async function catchmul()
    {
    const URL = `/mul`; 
    let data = {"number1":mul[0].value,"number2":mul[1].value} 
    const response = await fetch(URL,{method:"POST", body:JSON.stringify(data),headers: {'Content-Type': 'application/json' }}); 
    if(response.ok){ 
        let res = await response.text(); 
        console.log(res); 
    }
}
        
    });

