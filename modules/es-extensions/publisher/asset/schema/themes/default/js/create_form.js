/*
 *  Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
/**
 * [contains actions, for creating a schema name when the schema url is selected,
 * to show drop down menu for import & upload of schemas,
 * to call custom api
 * ]
 */
$(function() {
    //function to set the schema name from the schema url.
    $('input[name="overview_url"]').change(function() {
        var schemaUrl = $('input[name="overview_url"]').val();
        var schemaFileName = "";
        //This check seems unwanted, as registry does not support file
        //upload here.
        if (schemaUrl.indexOf("\\") != -1) {
            schemaFileName = schemaUrl.substring(schemaUrl.lastIndexOf('\\') + 1, schemaUrl.length);
        } else {
            schemaFileName = schemaUrl.substring(schemaUrl.lastIndexOf('/') + 1, schemaUrl.length);
        }
        if (schemaFileName.search(/\.[^?]*$/i) < 0) {
            schemaFileName = schemaFileName.replace("?", ".");
            var suffix = ".xsd";
            if (schemaFileName.indexOf(".") > 0) {
                schemaFileName = schemaFileName.substring(0, schemaFileName.lastIndexOf(".")) + suffix;
            } else {
                schemaFileName = schemaFileName + suffix;
            }
        }
        var notAllowedChars = "!@#;%^*+={}|<>";
        for (i = 0; i < notAllowedChars.length; i ++) {
            var c = notAllowedChars.charAt(i);
            schemaFileName = schemaFileName.replace(c, "_");
        }
        $('input[name="overview_name"]').val(schemaFileName);
    });
    //function to display upload or import uis.
    var uploadUI = $('#uploadUI');
    var importUI = $('#importUI');
    importUI.show();

    $('select').on('change', function() {
        var addSelector = $('#addMethodSelector');
        var selectedValue = addSelector.val();
        if (selectedValue == "upload") {
            uploadUI.show();
            importUI.hide();
        } else if (selectedValue == "import") {
            importUI.show();
            uploadUI.hide();
        }
    });
    //function to call the custom schema api or default api.
    $('form[name="form-asset-create"] input[type="submit"]').click(function(event) {
        var $form = $('form[name="form-asset-create"]');
        if ($(this).attr("name") == 'addNewSchemaFileAssetButton') {//upload via file browser
            //call the custom endpoint for processing schema upload via file browser.
            $form.attr('action', caramel.context + '/asts/schema/apis/schemas');
            var $schemaFileInput = $('input[name="schema_file"]');
            var schemaFileInputValue = $schemaFileInput.val();
            var schemaFilePath = schemaFileInputValue;
            var fileName = schemaFilePath.split('\\').reverse()[0];
            //set the zip file name, to the hidden attribute.
            $('input[name="schema_file_name"]').val(fileName);
            $form.submit();
        } else if ($(this).attr("name") == 'addNewAssetButton') {//upload via url.
            //call the default endpoint.
            $form.attr('action', caramel.context + '/apis/assets?type=schema');
            $form.submit();
        }
    });
});