({    
    handleCpf: function(cmp, event, helper) {      
        let cpf = cmp.find("auIdCpf").get("v.value");           
        let validRe = new RegExp("([0-9]{11})"); 
        let invalidRe = new RegExp("(0{9}|1{9}|2{9}|3{9}|4{9}|5{9}|6{9}|7{9}|8{9}|9{9})");
        let isValid = false;   
        console.log("validRe = " + validRe.test(cpf));
        console.log("InvalidRe =" + invalidRe.test(cpf));

        if(validRe.test(cpf) && !invalidRe.test(cpf)) {
            var maskedCpf = cpf.substring(0,3) + '.' + cpf.substring(3,6) +'.'+ cpf.substring(6,9)+'-'+ cpf.substring(9,11);     
            cmp.set("v.varCpf", maskedCpf);               
            isValid = this.validCpf(cmp, event, helper,cpf); 
            console.log("CPF VALIDO AEEEEEEEEEEEEEEEEEEEEE");         
        } else {
            console.log("CPF INVALIDO");
        }
    },  

    validCpf: function(cmp, event, helper, cpf) {              
        let soma=0;
        let resto=0;
        let c=1;
        let dig=0;


        for(var i=10; i>=2;i--){       
            soma+= parseInt(cpf.substring(c-1,c) * i ); 
            c++;               
        }

        dig = parseInt(cpf.substring(9,10));
        resto = (soma*10)%11;  
        if(resto==dig){
            c=1;
            soma =0 ;
            for(i=11; i>=2;i--){       
                soma+= parseInt(cpf.substring(c-1,c) * i ); 
                c++;               
            }       
            resto = (soma*10)%11;
            dig = parseInt(cpf.substring(10,11));          
            if(resto ==dig)
                return true;
            else 
                return false;             
        }        
        return false;       
    }
})
