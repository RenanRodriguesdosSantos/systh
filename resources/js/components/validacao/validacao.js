function validar(type, newValue, oldValue = ""){
    var key = "";
    if(newValue.length == 1){
        key = newValue[0];
    }
    else{
        for(var i = 0; i < oldValue.length; i++){
            if(oldValue[i] != newValue[i]){
                key = newValue[i];
                break;
            }
        }
    }
    if(key == ""){
        key = newValue[newValue.length-1];
    }
    if(newValue.length < oldValue.length){
        return newValue;
    }

    if(type == 'text'){
        if(    key == 'A' 
            || key == 'B'
            || key == 'C'
            || key == 'D'
            || key == 'E'
            || key == 'F'
            || key == 'G'
            || key == 'H'
            || key == 'I'
            || key == 'J'
            || key == 'K'
            || key == 'L'
            || key == 'M'
            || key == 'N'
            || key == 'O'
            || key == 'P'
            || key == 'Q'
            || key == 'R'
            || key == 'S'
            || key == 'T'
            || key == 'U'
            || key == 'V'
            || key == 'W'
            || key == 'X'
            || key == 'Y'
            || key == 'Z'
        ){
            return newValue;
        }
        else if (key == ' '){
            var repetido = false;
            if(newValue[0] == ' '){
                repetido = true;
            }
            else{
                for(var i = 0; i < newValue.length - 1; i++){
                    if(newValue[i] == ' ' && newValue[i + 1] == ' '){
                        if(i != 0){
                            repetido = true;
                            break;
                        }
                    }
                }
            }
            if(!repetido){
                return newValue;
            }
        }
    }
    else if(type == 'int'){
        if(    key == '0'
            || key == '1'
            || key == '2'
            || key == '3'
            || key == '4'
            || key == '5'
            || key == '6'
            || key == '7'
            || key == '8'
            || key == '9'
        ){
            return newValue;
        }
    }
    else if(type == 'float'){
        if(    key == '0'
            || key == '1'
            || key == '2'
            || key == '3'
            || key == '4'
            || key == '5'
            || key == '6'
            || key == '7'
            || key == '8'
            || key == '9'
        ){
            return newValue;
        }
        else if( key == '.' || key == ','){
            var japossui = false;
            for(var i = 0; i < oldValue.length; i++){
                if(oldValue[i] == ',' || oldValue[i] == '.'){
                    japossui = true;
                    break;
                }
            }
            if(!japossui && (newValue.length != 1)){
                return newValue;
            }
        }
    }
    else if (type == 'date'){
        return newValue;
    }
    return oldValue;
}

export default validar;