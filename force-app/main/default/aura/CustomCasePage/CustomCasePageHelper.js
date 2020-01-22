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
            isValid = this.validateCpf(cmp, event, helper,newCpf);   
            console.log("ISVALID " + isValid);             
        } else  {
           this.showToast(cmp,event,helper, "CPF Incorreto!", "warning", "Por favor, confira o seu CPF.");
           cmp.set("v.wasFound", false);
           return;
        }       
   
        if(!isValid){ 
            this.showToast(cmp,event,helper, "CPF Invalido!", "warning", "Por favor, confira o seu CPF.");
            cmp.set("v.wasFound", false);
            return;
        }           
        var action = cmp.get("c.searchAccount");           
        action.setParams({
            cpf: newCpf
        });
        action.setCallback(this, function(data){     
            if(data.getState() == "SUCCESS"){                   
                var result = data.getReturnValue();
               // console.log(result);                  
                if(result['id']!=null){           
                    cmp.set("v.accountId", result['id']);            
                    cmp.set("v.wasFound", true);                    
                    cmp.set("v.varFullName", result['name']);
                } else{     
                    //console.log("account not found");   
                    this.showToast(cmp,event,helper, "CPF não encontrado.", "warning", "Por favor, confira o seu CPF.");                
                    cmp.set("v.wasFound", false);     
                }           
            } else {
                this.showToast(cmp,event,helper, "Ocorreu um problema!", "error", 
                "Houve um erro BAD REQUEST!!!");
            }                  
        });
        $A.enqueueAction(action);        
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
        //console.log("CPF " + cpf);
        for(var i=10; i>=2;i--){       
            soma+= parseInt(cpf.substring(c-1,c) * i ); 
            c++;               
        }
        dig = parseInt(cpf.substring(9,10));        
        resto = (soma*10)%11; 
        if(resto == 10)resto = 0;
       // console.log("Primeiro digito " + dig + " resto " + resto);
        if(resto==dig){
            c=1;
            soma =0 ;
            for(i=11; i>=2;i--){       
                soma+= parseInt(cpf.substring(c-1,c) * i ); 
                c++;               
            }       
            resto = (soma*10)%11;
            if(resto == 10)resto = 0;
            dig = parseInt(cpf.substring(10,11)); 
            console.log("Segundo digito " + dig + " resto " + resto);            
            if(resto==dig){
                return true;
            }                
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

        let accountId = cmp.get("v.accountId");
        let name = cmp.get("v.varFullName");
        let option = cmp.find("idInputCaseType").get("v.value");        
        let newDescription = cmp.find("auIdDescription").get("v.value");
        
        let submitAction =   cmp.get("c.submitCase");

        submitAction.setParams({
            id: accountId,
            accountName: name,
            selectedOption: option,
            description: newDescription
        });

        submitAction.setCallback(this, function(data){ 
            if(data.getState()=="SUCCESS") {
                this.clearFields(cmp,event,helper);
                this.showToast(cmp,event,helper, "Caso aberto com sucesso!", "success", 
                "Seu caso foi aberto, aguarde um de nossos atendentes!");
            } else {
                this.showToast(cmp,event,helper, "Ocorreu um problema!", "error", 
                "Houve um erro ao abrir seu caso. Por favor, conferir seu CPF");
            }               
        });
        $A.enqueueAction(submitAction);
    },

    clearFields: function(cmp, event, helper){

      cmp.set("v.varCpf", "");
      cmp.set("v.varFullName", "");
      cmp.set("v.wasFound", false);
     
    },

    showToast : function(component, event, helper, customTitle, customType, customMessage) {      
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": customTitle,
            "type" : customType,          
            "message": customMessage
        });
        toastEvent.fire();
    }
})