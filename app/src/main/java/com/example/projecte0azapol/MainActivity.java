package com.example.projecte0azapol;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.service.autofill.TextValueSanitizer;
import android.util.Log;
import android.widget.TextView;

import org.w3c.dom.Text;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Log.d("Prova", "hola");
        Log.d("Prova2", "adeu");
    }
}