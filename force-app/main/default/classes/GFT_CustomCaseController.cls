public with sharing class GFT_CustomCaseController {
    
    @AuraEnabled  
    public static Object searchAccount(String cpf) {        
        GFT_CustomCase customCase = new GFT_CustomCase(cpf);     
        return customCase.getAccount();   
    }

    @AuraEnabled
    public static void submitCase(){
       
    }
}
