window.addEventListener('load',()=>{

    console.log("calc page loaded");
    // Add your JS code below
    let submitcard        = document.querySelector(".Submitbtn");
    let sum_Ans        = document.querySelector(".S_ans");
    let submitcardMUl        = document.querySelector(".SubmitbtnMul");
    let mul_Ans        = document.querySelector(".M_ans");
    let tempcard       = document.querySelector(".temp");
    let temp_Ans        = document.querySelector(".T_ans");
    let t_num1      = document.querySelector("#number");


    let s_num1      = document.querySelector("#number1");
    let s_num2      = document.querySelector("#number2");

    let m_num1      = document.querySelector("#Mnumber1");
    let m_num2      = document.querySelector("#Mnumber2");

    
    submitcard.addEventListener("click",async ()=>{ 
        console.log("sum submit Button clicked");

        
       // GET REQUEST 
       const URL = `/sum?number1=${s_num1.value}&number2=${s_num2.value}`; 
       const response = await fetch(URL); 
       if(response.ok)
       { 
        let res = await response.text(); 
        console.log(res); 
        sum_Ans.innerHTML = res;
    }

    


  });

  submitcardMUl.addEventListener("click",async ()=>{ 
    console.log("Mul submit Button clicked");

    // POST REQUEST 
        
        const URL = `/mul`; 
        let data = {"number1":m_num1.value,"number2":m_num2.value} 
        const response = await fetch(URL,{method:"POST", body:JSON.stringify(data),headers: {'Content-Type': 'application/json' }}); 
        if(response.ok){ 
            let res = await response.text(); 
            console.log(res); 
            mul_Ans.innerHTML = res;
        }

  });
  tempcard.addEventListener("click",async ()=>{ 
    console.log("Temp submit Button clicked");

    // POST REQUEST 
        
        const URL = `/temp`; 
        let data = {"number":t_num1.value} 
        const response = await fetch(URL,{method:"POST", body:JSON.stringify(data),headers: {'Content-Type': 'application/json' }}); 
        if(response.ok){ 
            let res = await response.text(); 
            console.log(res); 
            temp_Ans.innerHTML = res;
        }

  });

    });


    

