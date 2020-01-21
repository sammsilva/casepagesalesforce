public with sharing class GFT_CustomCase {
    private String cpf;
    public GFT_CustomCase(String newCpf) {
        this.cpf = newCpf;
    }
   
    @AuraEnabled  
    public Object getAccount(){  
        Map<String,String> data = new Map<String,String>();     
        try{
            Account accountFound = [SELECT id, Name, AccountNumber FROM Account WHERE AccountNumber=:cpf LIMIT 1];              
            data.put('id', String.valueOf(accountFound.Id));
            data.put('name', String.valueOf(accountFound.Name));
            return data;
        } catch (Exception e ){           
            System.debug(e.getMessage() + 'Account not found');
        }
        return null;        
    }

    @AuraEnabled
    public static Object submitCase(String id, String selectedOption, String description){   
        Case c = new Case();
        try{
            
            c.Accountid = id;
            c.Type = selectedOption;
            c.Status = 'New';     
            INSERT c;
            return c;   
        }   catch(Exception e){
            System.debug(e.getMessage());
        }  

        return c;
             
    }
}
