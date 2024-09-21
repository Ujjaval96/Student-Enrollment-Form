
        var jpdbBaseURL = 'http://api.login2explore.com:5577';
        var jpdbIRL = "/api/irl";
        var jpdbIML = "/api/iml";
        var empDBName = "SCHOOL-DB"; 
        var empRelationName = "STUDENT-TABLE"; 
        var connToken = "90932001|-31949225494964656|90962634";
        $("#rollNo").focus();
        function saveRecNoToLS(jsonObj) {
            var lvdata = JSON.parse(jsonObj.data);
            localStorage.setItem('recno', lvdata.rec_no);
        }
        function getStuIdAsJsonObj() {
            var rollNoVar = $("#rollNo").val();
            return JSON.stringify({ id: rollNoVar });
        }
        function fillData(jsonObj) {
            saveRecNoToLS(jsonObj);
            var record = JSON.parse(jsonObj.data).record;
            $("#rollNo").val(record.rollNo);
            $("#fullName").val(record.fullName);
            $("#class").val(record.class);
            $("#birthDate").val(record.birthDate);
            $("#address").val(record.address);
            $("#enrollmentDate").val(record.enrollmentDate);
            
        }
        function resetForm() {
            $("#rollNo").val("");
            $("#fullName").val("");
            $("#class").val("");
            $("#birthDate").val("");
            $("#address").val("");
            $("#enrollmentDate").val("");
            $("#rollNo").prop("disabled", true);
            $("#saveButton").prop("disabled", true);
            $("#updateButton").prop("disabled", true);
            $("#resetButton").prop("disabled", true);
            $("#rollNo").focus();
        }
        function validateAndGetFormData() {
            var rollNoVar = $("#rollNo").val();
            if (rollNoVar === "") {
                alert("Roll Number is required.");
                $("#rollNo").focus();
                return "";
            }
            var fullNameVar = $("#fullName").val();
            if (fullNameVar === "") {
                alert("Full Name is required.");
                $("#fullName").focus();
                return "";
            }
            var classVar = $("#class").val();
            if (classVar === "") {
                alert("Class is required.");
                $("#class").focus();
                return "";
            }
            var birthDateVar = $("#birthDate").val();
            if (birthDateVar === "") {
                alert("Birth Date is required.");
                $("#birthDate").focus();
                return "";
            }
            var addressVar = $("#address").val();
            if (addressVar === "") {
                alert("Address is required.");
                $("#address").focus();
                return "";
            }
            var enrollmentDateVar = $("#enrollmentDate").val();
            if (enrollmentDateVar === "") {
                alert("Enrollment Date is required.");
                $("#enrollmentDate").focus();
                return "";
            }
    
            var jsonStrObj = {
                rollNo: rollNoVar,
                fullName: fullNameVar,
                class: classVar,
                birthDate: birthDateVar,
                address: addressVar,
                enrollmentDate: enrollmentDateVar
            };
            return JSON.stringify(jsonStrObj);
        }
    
        function getStu() {
            var stuIdJsonObj = getStuIdAsJsonObj();
            var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, stuIdJsonObj);
            
            jQuery.ajaxSetup({ async: false });
            var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
            jQuery.ajaxSetup({ async: true });
        
            if (resJsonObj.status === 400) {

                $("#saveButton").prop("disabled", false);
                $("#resetButton").prop("disabled", false);
                $("#fullName").focus();
            } else if (resJsonObj.status === 200) {
                $("#rollNo").prop("disabled", true);
                fillData(resJsonObj);
                $("#updateButton").prop("disabled", false);
                $("#resetButton").prop("disabled", false);
                $("#fullName").focus();
            } else {
                alert("Error retrieving data: " + resJsonObj.message || "Unknown error occurred.");
            }
        }
        
    
        
    
        function saveStudent() {
            var jsonStrObj = validateAndGetFormData();
            if (jsonStrObj === "") {
                return "";
            }
            var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
            jQuery.ajaxSetup({ async: false });
        
            try {
                var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
                jQuery.ajaxSetup({ async: true });
        
                if (resJsonObj.status === 200) {
                    alert("Student data saved successfully!");
                    resetForm();
                    $("#rollNo").focus();
                } else {
                    alert("Error saving data: " + resJsonObj.message);
                }
            } catch (error) {
                console.error("AJAX error: ", error);
                alert("An error occurred while saving data: " + error.message);
            }
        }
            
        function changeStudent() {
            $('#updateButton').prop("disabled",true);
            var jsonStrObj = validateAndGetFormData();
            if (jsonStrObj === "") {
                return;
            }
            var updateRequest = createUPDATERecordRequest(connToken, jsonStrObj, empDBName, empRelationName, localStorage.getItem('recno'));
            jQuery.ajaxSetup({ async: false });
        
            try {
                var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
                jQuery.ajaxSetup({ async: true });
        
                if (resJsonObj.status === 200) {
                    alert("Student data updated successfully!");
                    resetForm();
                    $("#rollNo").focus();
                } else {
                    alert("Error updating data: " + resJsonObj.message);
                }
            } catch (error) {
                console.error("AJAX error: ", error);
                alert("An error occurred while updating data: " + error.message);
            }
        }
        
    
