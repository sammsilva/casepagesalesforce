({
    doInit: function(cmp, event, helper) {

    },

    handleCpf: function(cmp, event, helper) {      
       helper.handleCpf(cmp,event, helper);
    },

    handleCpfMask: function(cmp, event, helper) {      
        helper.handleCpfMask(cmp,event, helper);
    },

    onSubmitCase: function(cmp, event, helper){
        helper.submitCase(cmp,event,helper);
    },

    onCancelClick:function (cmp, event, helper){
        helper.clearFields(cmp, event, helper);
    }
})