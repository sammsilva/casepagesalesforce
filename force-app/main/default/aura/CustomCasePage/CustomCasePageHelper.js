({    
    handleCpf: function(cmp, event, helper) {   
        let newCpf = cmp.find("auIdCpf").get("v.value");    
        console.log("chamou handleCpf"); 
        newCpf = this.removeMask(cmp,event,helper, newCpf);           
        let validDigRe = new RegExp("([0-9]{11})"); 
        let invalidDigRe = new RegExp("(0{9}|1{9}|2{9}|3{9}|4{9}|5{9}|6{9}|7{9}|8{9}|9{9})");
        let isValid = false;  
        if(validDigRe.test(newCpf) && !invalidDigRe.test(newCpf)) {           
            isValid = this.validateCpf(cmp, event, helper,newCpf);                
        } else  {
           console.log("Digitos invalidos"); 
        }        

        if(isValid){            
            var action = cmp.get("c.searchAccount");           
            action.setParams({
                cpf: newCpf
            });
            action.setCallback(this, function(data){      
                console.log(data.getReturnValue());
                if(data.getState() == "SUCCESS"){                   
                    var result = data.getReturnValue(); 
                    if(result['id']!=null){
                        cmp.set("v.wasFound", true);                    
                        cmp.set("v.varFullName", result['name']);
                    } else {
                        console.log("account not found");
                    }                
                } else {
                    console.log("BAD REQUEST");
                }                  
            });
            $A.enqueueAction(action);
        }
    },  

    handleCpfMask: function(cmp, event,helper){        
        let newCpf = cmp.find("auIdCpf").get("v.value");               
        switch(newCpf.length) {
            case 3:
                cmp.set("v.varCpf", newCpf.substring(0,3) + '.'); 
                break;
            case 7:
                cmp.set("v.varCpf", newCpf.substring(0,8) + '.'); 
                break;
            case 11:    
                cmp.set("v.varCpf", newCpf.substring(0,11) + '-');                 
                break;
        }
    },

    validateCpf: function(cmp, event, helper, cpf) {              
        let soma=0;
        let resto=0;
        let c=1;
        let dig=0;

        for(var i=10; i>=2;i--){       
            soma+= parseInt(cpf.substring(c-1,c) * i ); 
            c++;               
        }

        dig = parseInt(cpf.substring(9,10));
        if(resto == 10) resto = 0;
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
            if(resto == 10) resto = 0;      
         
            if(resto==dig)
                return true;
            else 
                return false;             
        }        
        return false;       
    },

    removeMask: function(cmp,event, helper, cpf){     
        var newCpf = cpf; 
        newCpf = cpf.split('.').join("");       
        newCpf = newCpf.replace("-", "");        
        return newCpf;
    }
})
