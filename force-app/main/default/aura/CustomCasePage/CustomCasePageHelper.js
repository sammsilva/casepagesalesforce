({    
    handleCpf: function(cmp, event, helper) {
        let cpf = cmp.find("auIdCpf").get("v.value"); 
        if(cpf.length<11)
            return;        
        //console.log("passou de 11");
        let newCpf = this.removeMask(cmp, event, helper, cpf); 
        //console.log("tirou qlq pontuacao");     
        this.handleCpfFieldMask(cmp, event, helper,newCpf);
        //console.log("colocou mask no field");
        let validDigRe = new RegExp("([0-9]{11})"); 
        let invalidDigRe = new RegExp("(0{9}|1{9}|2{9}|3{9}|4{9}|5{9}|6{9}|7{9}|8{9}|9{9})");
        let isValid = false;  
        if(validDigRe.test(newCpf) && !invalidDigRe.test(newCpf)) {  
            //console.log("INPUTS VALIDOS");        
            isValid = this.validateCpf(cmp, event, helper,newCpf);                
        } else  {
           //console.log("INPUTS invalidos"); 
           cmp.set("v.wasFound", false);
        }       
   

        if(isValid){            
            var action = cmp.get("c.searchAccount");           
            action.setParams({
                cpf: newCpf
            });
            action.setCallback(this, function(data){     
                if(data.getState() == "SUCCESS"){                   
                    var result = data.getReturnValue();                  
                    if(result['id']!=null){           
                        cmp.set("v.accountId", result['id']);            
                        cmp.set("v.wasFound", true);                    
                        cmp.set("v.varFullName", result['name']);
                    } else{                        
                        cmp.set("v.wasFound", false);     
                    }           
                } else {
                    console.log("BAD REQUEST");
                }                  
            });
            $A.enqueueAction(action);
        }
    },  

    handleCpfFieldMask: function(cmp, event,helper, cpf){      
        let newCpf = cpf; 
        let cpfHolder = newCpf.split(''); 
        if(newCpf.length==11){
            cmp.set("v.varCpf", cpfHolder[0] + cpfHolder[1] + cpfHolder[2] + '.' + cpfHolder[3] + 
                                cpfHolder[4] + cpfHolder[5] + '.'+ cpfHolder[6] + cpfHolder[7] + cpfHolder[8] + '-' + 
                                cpfHolder[9] + cpfHolder[10]);                   
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
        let newCpf = cpf; 
        newCpf = cpf.split('.').join("");       
        newCpf = newCpf.replace("-", "");            
        return newCpf;
    },

    submitCase: function(cmp,event, helper){     

        let id = cmp.get("v.accountId");
        let option = cmp.find("idInputCaseType").get("v.value");        
        let newDescription = cmp.find("auIdDescription").get("v.value");
        
        let submitAction =   cmp.get("c.submitCase");

        submitAction.setCallback(this, function(data){     
            
            console.log(data.getReturnValue());
        });
        $A.enqueueAction(submitAction);
    }
})
