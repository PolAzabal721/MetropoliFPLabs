package com.example.projecte0azapol;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.service.autofill.TextValueSanitizer;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import org.w3c.dom.Text;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    TextView text;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button boto = (Button) findViewById(R.id.lastButton);
        boto.setOnClickListener(this);
    }

    //COMPROVA SI TOTES LES CHECKBOX ESTAN SELECCIONADES
    public boolean questionSelected(RadioGroup ... grupo){
        boolean result= true;
            for(RadioGroup grupoBotones: grupo ){
                if(grupoBotones.getCheckedRadioButtonId() == -1 ){
                    result=false;
                }
            }
        return result;
    }

    //IMPRIMIR RESPUESTAS SELECCIONADAS
    public String respuestas(RadioGroup ... grupoRespuestas){
        String imprimir= "";
        int contador=1;
            for (RadioGroup respostas: grupoRespuestas ){
             int idRes= respostas.getCheckedRadioButtonId();
                RadioButton boto = (RadioButton) findViewById(idRes);
                imprimir= imprimir +"Pregunta "+ contador+ ": "+ boto.getText()+"\n";
                contador++;
            }
        return imprimir;
    }

    @Override
    public void onClick(View view) {
        RadioGroup question1 = (RadioGroup) findViewById(R.id.radioGroup1);
        RadioGroup question2 = (RadioGroup) findViewById(R.id.radioGroup2);
        RadioGroup question3 = (RadioGroup) findViewById(R.id.radioGroup3);
        RadioGroup question4 = (RadioGroup) findViewById(R.id.radioGroup4);
        RadioGroup question5 = (RadioGroup) findViewById(R.id.radioGroup5);
        RadioGroup question6 = (RadioGroup) findViewById(R.id.radioGroup6);
        RadioGroup question7 = (RadioGroup) findViewById(R.id.radioGroup7);
        RadioGroup question8 = (RadioGroup) findViewById(R.id.radioGroup8);
        RadioGroup question9 = (RadioGroup) findViewById(R.id.radioGroup9);
        RadioGroup question10 = (RadioGroup) findViewById(R.id.radioGroup10);

        if(questionSelected(question1, question2, question3, question4, question5, question6, question7, question8, question9, question10) == false){
            Toast toast = Toast.makeText(this, "Preguntas no enviades", Toast.LENGTH_LONG);
            toast.show();
        }
        else{
            Toast toast = Toast.makeText(this, "Preguntas enviades", Toast.LENGTH_LONG);
            toast.show();
            Log.d("RESPUESTAS", respuestas(question1, question2, question3, question4, question5, question6, question7, question8, question9, question10));
        }

    }
}