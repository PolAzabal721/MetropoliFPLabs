package com.example.projecte0azapol;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.service.autofill.TextValueSanitizer;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import org.w3c.dom.Text;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    TextView text;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        text= (TextView) findViewById(R.id.Titulo);
        Button boto = (Button) findViewById(R.id.lastButton);
        boto.setOnClickListener(this);
    }

    @Override
    public void onClick(View view) {
        text.setText("Has premut el botó");
    }
}