define([], function(){

function anonymous(it /**/) { var out='<table class=\'table table-striped table-hover\'> <thead> <tr> ';var arr1=it.columns;if(arr1){var column,j=-1,l1=arr1.length-1;while(j<l1){column=arr1[j+=1];out+=' <th>'+(column.$text || column.property || column)+'</th> ';} } out+=' </tr> </thead> <tbody> ';var arr2=it.value;if(arr2){var row,i=-1,l2=arr2.length-1;while(i<l2){row=arr2[i+=1];out+=' <tr> ';var arr3=it.columns;if(arr3){var column,j=-1,l3=arr3.length-1;while(j<l3){column=arr3[j+=1];out+=' <td> '+( row[column.property].$html || row[column.property] || '' )+' </td> ';} } out+=' </tr> ';} } out+=' </tbody></table>';return out; }

return anonymous;
});