package com.example.projecte0azapol;

import android.os.Bundle;
import android.os.Handler;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.POST;
import retrofit2.http.Query;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String BASE_URL = "http://192.168.205.251:3000/";
    private ArrayList<TextView> textosTitulo;
    private ArrayList<ArrayList<RadioButton>> txtRespuestas;
    private TextView textViewTempo;
    private Button lastButton;
    private long startTimeMillis;
    private boolean isTimerRunning = false;
    private Handler handler = new Handler();
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button botonEnviar = findViewById(R.id.lastButton);
        botonEnviar.setOnClickListener(this);

        // TIEMPOS
        textViewTempo = findViewById(R.id.textViewTempo);
        lastButton = findViewById(R.id.lastButton);

        // Inicializar el ArrayList de textos
        textosTitulo = crearArrayTextos();
        txtRespuestas =crearArrayRespuestas();

        ViewTreeObserver viewTreeObserver = txtRespuestas.get(0).get(0).getViewTreeObserver();
        viewTreeObserver.addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                // RadioButtons completamente inicializados
                obtenerRespuestas();

                txtRespuestas.get(0).get(0).getViewTreeObserver().removeOnGlobalLayoutListener(this);
            }
        });

        // Iniciar el contador de tiempo cuando se carga la actividad
        startTimer();

        obtenerPreguntas();
    }

    public ArrayList<TextView> crearArrayTextos() {
        ArrayList<TextView> textos = new ArrayList<>();
        // Agrega tus TextViews al ArrayList aquí
        textos.add(findViewById(R.id.textViewPregunta1));
        textos.add(findViewById(R.id.textViewPregunta2));
        textos.add(findViewById(R.id.textViewPregunta3));
        textos.add(findViewById(R.id.textViewPregunta4));
        textos.add(findViewById(R.id.textViewPregunta5));
        textos.add(findViewById(R.id.textViewPregunta6));
        textos.add(findViewById(R.id.textViewPregunta7));
        textos.add(findViewById(R.id.textViewPregunta8));
        textos.add(findViewById(R.id.textViewPregunta9));
        textos.add(findViewById(R.id.textViewPregunta10));
        return textos;
    }

    public ArrayList<ArrayList<RadioButton>> crearArrayRespuestas() {
        ArrayList<ArrayList<RadioButton>> txtRespuestas = new ArrayList<>();

        // Agregar los RadioButtons de cada conjunto a la lista
        ArrayList<RadioButton> respuestasPregunta1 = new ArrayList<>();
        respuestasPregunta1.add(findViewById(R.id.radioButton));
        respuestasPregunta1.add(findViewById(R.id.radioButton2));
        respuestasPregunta1.add(findViewById(R.id.radioButton3));
        respuestasPregunta1.add(findViewById(R.id.radioButton4));
        txtRespuestas.add(respuestasPregunta1);

        ArrayList<RadioButton> respuestasPregunta2 = new ArrayList<>();
        respuestasPregunta2.add(findViewById(R.id.radioButton5));
        respuestasPregunta2.add(findViewById(R.id.radioButton6));
        respuestasPregunta2.add(findViewById(R.id.radioButton7));
        respuestasPregunta2.add(findViewById(R.id.radioButton8));
        txtRespuestas.add(respuestasPregunta2);

        // Agregar los RadioButtons de la tercera pregunta
        ArrayList<RadioButton> respuestasPregunta3 = new ArrayList<>();
        respuestasPregunta3.add(findViewById(R.id.radioButton31));
        respuestasPregunta3.add(findViewById(R.id.radioButton32));
        respuestasPregunta3.add(findViewById(R.id.radioButton33));
        respuestasPregunta3.add(findViewById(R.id.radioButton34));
        txtRespuestas.add(respuestasPregunta3);

        // Agregar los RadioButtons de la cuarta pregunta
        ArrayList<RadioButton> respuestasPregunta4 = new ArrayList<>();
        respuestasPregunta4.add(findViewById(R.id.radioButton41));
        respuestasPregunta4.add(findViewById(R.id.radioButton42));
        respuestasPregunta4.add(findViewById(R.id.radioButton43));
        respuestasPregunta4.add(findViewById(R.id.radioButton44));
        txtRespuestas.add(respuestasPregunta4);

        // Agregar los RadioButtons de la quinta pregunta
        ArrayList<RadioButton> respuestasPregunta5 = new ArrayList<>();
        respuestasPregunta5.add(findViewById(R.id.radioButton51));
        respuestasPregunta5.add(findViewById(R.id.radioButton52));
        respuestasPregunta5.add(findViewById(R.id.radioButton53));
        respuestasPregunta5.add(findViewById(R.id.radioButton54));
        txtRespuestas.add(respuestasPregunta5);

        // Agregar los RadioButtons de la sexta pregunta
        ArrayList<RadioButton> respuestasPregunta6 = new ArrayList<>();
        respuestasPregunta6.add(findViewById(R.id.radioButton61));
        respuestasPregunta6.add(findViewById(R.id.radioButton62));
        respuestasPregunta6.add(findViewById(R.id.radioButton63));
        respuestasPregunta6.add(findViewById(R.id.radioButton64));
        txtRespuestas.add(respuestasPregunta6);

        // Agregar los RadioButtons de la séptima pregunta
        ArrayList<RadioButton> respuestasPregunta7 = new ArrayList<>();
        respuestasPregunta7.add(findViewById(R.id.radioButton71));
        respuestasPregunta7.add(findViewById(R.id.radioButton72));
        respuestasPregunta7.add(findViewById(R.id.radioButton73));
        respuestasPregunta7.add(findViewById(R.id.radioButton74));
        txtRespuestas.add(respuestasPregunta7);

        // Agregar los RadioButtons de la octava pregunta
        ArrayList<RadioButton> respuestasPregunta8 = new ArrayList<>();
        respuestasPregunta8.add(findViewById(R.id.radioButton81));
        respuestasPregunta8.add(findViewById(R.id.radioButton82));
        respuestasPregunta8.add(findViewById(R.id.radioButton83));
        respuestasPregunta8.add(findViewById(R.id.radioButton84));
        txtRespuestas.add(respuestasPregunta8);

        // Agregar los RadioButtons de la novena pregunta
        ArrayList<RadioButton> respuestasPregunta9 = new ArrayList<>();
        respuestasPregunta9.add(findViewById(R.id.radioButton91));
        respuestasPregunta9.add(findViewById(R.id.radioButton92));
        respuestasPregunta9.add(findViewById(R.id.radioButton93));
        respuestasPregunta9.add(findViewById(R.id.radioButton94));
        txtRespuestas.add(respuestasPregunta9);

        // Agregar los RadioButtons de la décima pregunta
        ArrayList<RadioButton> respuestasPregunta10 = new ArrayList<>();
        respuestasPregunta10.add(findViewById(R.id.radioButton100));
        respuestasPregunta10.add(findViewById(R.id.radioButton102));
        respuestasPregunta10.add(findViewById(R.id.radioButton103));
        respuestasPregunta10.add(findViewById(R.id.radioButton104));
        txtRespuestas.add(respuestasPregunta10);

        return txtRespuestas;
    }


    private void obtenerPreguntas() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        ApiService apiService = retrofit.create(ApiService.class);
        Call<List<Pregunta>> call = apiService.obtenerPreguntas();

        call.enqueue(new Callback<List<Pregunta>>() {
            @Override
            public void onResponse(Call<List<Pregunta>> call, Response<List<Pregunta>> response) {
                if (response.isSuccessful()) {
                    List<Pregunta> preguntas = response.body();
                    if (preguntas != null && preguntas.size() == textosTitulo.size()) {
                        for (int i = 0; i < textosTitulo.size(); i++) {
                            textosTitulo.get(i).setText(preguntas.get(i).getPregunta());
                            textosTitulo.get(i).setTag(preguntas.get(i).getId());
                        }
                    }
                } else {
                    // Manejar una respuesta no exitosa aquí
                    Log.e("HTTP Error", "Código de respuesta HTTP: " + response.code());
                    Toast.makeText(MainActivity.this, "Error al obtener preguntas", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Pregunta>> call, Throwable t) {
                // Manejar errores de la solicitud aquí
                Log.e("Error de conexión", "Error al conectarse al servidor: " + t.getMessage());
                Toast.makeText(MainActivity.this, "Error de conexión", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void obtenerRespuestas() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        ApiService apiService = retrofit.create(ApiService.class);
        Call<List<Pregunta>> call = apiService.obtenerPreguntas();

        call.enqueue(new Callback<List<Pregunta>>() {
            @Override
            public void onResponse(Call<List<Pregunta>> call, Response<List<Pregunta>> response) {
                if (response.isSuccessful()) {
                    List<Pregunta> preguntas = response.body();
                    if (preguntas != null) {
                        for (int i = 0; i < preguntas.size(); i++) {
                            Pregunta pregunta = preguntas.get(i);
                            String preguntaTexto = pregunta.getPregunta();

                            // Configura el RadioButton correspondiente aquí
                            int respuestaCorrectaIndex = -1;

                            for (int j = 0; j < pregunta.getRespuestas().size(); j++) {
                                Respuesta respuesta = pregunta.getRespuestas().get(j);
                                String respuestaTexto = respuesta.getRespuesta();

                                if (respuesta.isCorrecta()) {
                                    respuestaCorrectaIndex = j;
                                }

                                // Configura el RadioButton
                                RadioButton radioButton = txtRespuestas.get(i).get(j);
                                radioButton.setText(respuestaTexto);
                                radioButton.setTag(respuesta.getId());
                            }

                            if (respuestaCorrectaIndex != -1) {
                                Respuesta respuestaCorrecta = pregunta.getRespuestas().get(respuestaCorrectaIndex);
                            }
                        }
                    }
                } else {
                    Log.e("HTTP Error", "Código de respuesta HTTP: " + response.code());
                    Toast.makeText(MainActivity.this, "Error al obtener respuestas", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Pregunta>> call, Throwable t) {
                Log.e("Error de conexión", "Error al conectarse al servidor: " + t.getMessage());
                Toast.makeText(MainActivity.this, "Error de conexión", Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void onClick(View v) {
        // Obtener las respuestas seleccionadas
        RadioGroup question1 = findViewById(R.id.radioGroup1);
        RadioGroup question2 = findViewById(R.id.radioGroup2);
        RadioGroup question3 = findViewById(R.id.radioGroup3);
        RadioGroup question4 = findViewById(R.id.radioGroup4);
        RadioGroup question5 = findViewById(R.id.radioGroup5);
        RadioGroup question6 = findViewById(R.id.radioGroup6);
        RadioGroup question7 = findViewById(R.id.radioGroup7);
        RadioGroup question8 = findViewById(R.id.radioGroup8);
        RadioGroup question9 = findViewById(R.id.radioGroup9);
        RadioGroup question10 = findViewById(R.id.radioGroup10);
        if (isTimerRunning) {
            // Detener el contador de tiempo
            handler.removeCallbacks(updateTimer);
            isTimerRunning = false;

            // Calcular el tiempo transcurrido
            long endTimeMillis = SystemClock.elapsedRealtime();
            long elapsedTimeMillis = endTimeMillis - startTimeMillis;

            // Crear una lista de objetos Respuesta en formato JSON
            List<Respuesta> respuestasList = new ArrayList<>();
            for (int i = 0; i < 10; i++) {

                //ID
                int preguntaId = i + 1;
                String radioGroupName = "radioGroup" + preguntaId;
                int radioGroupId = getResources().getIdentifier(radioGroupName, "id", getPackageName());

                RadioGroup respuestas = findViewById(radioGroupId);
                int idRes = respuestas.getCheckedRadioButtonId();
                RadioButton boton = findViewById(idRes);

                Respuesta respuesta = new Respuesta(preguntaId,"Pregunta " + preguntaId, boton.getText().toString(), elapsedTimeMillis/1000);
                respuestasList.add(respuesta);
            }

            // Configurar Retrofit
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            final ApiService apiService = retrofit.create(ApiService.class);

            // Enviar las respuestas al servidor
            Call<Void> call = apiService.enviarRespuestas(respuestasList);

            call.enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if (response.isSuccessful()) {
                        // Respuesta exitosa del servidor
                        Log.d("Server Response", "Respuestas enviadas con éxito");
                        Toast.makeText(MainActivity.this, "Respuestas enviadas con éxito", Toast.LENGTH_SHORT).show();
                    } else {
                        // Error en la respuesta del servidor
                        Log.e("HTTP Error", "Código de respuesta HTTP: " + response.code());
                        Toast.makeText(MainActivity.this, "Error al enviar respuestas", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    // Error en la solicitud
                    Log.e("Error de conexión", "Error al conectarse al servidor: " + t.getMessage());
                    Toast.makeText(MainActivity.this, "Error de conexión", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }


    //COMPROBAR SI TODAS LAS RADIOBUTTONS ESTÁN SELECCIONADAS
    public boolean questionSelected(RadioGroup... grupo) {
        boolean result = true;
        for (RadioGroup grupoBotones : grupo) {
            if (grupoBotones.getCheckedRadioButtonId() == -1) {
                result = false;
                break;
            }
        }
        return result;
    }

    // API
    private interface ApiService {
        @POST("getPreguntes")
        Call<List<Pregunta>> obtenerPreguntas();
        @POST("getPreguntes")
        Call<List<Respuesta>> obtenerRespuestas();
        @POST("enviarRespuestas")
        Call<Void> enviarRespuestas(@Body List<Respuesta> respuestas);
        @POST("enviarRespuestas")
        Call<Void> enviarTiempo(@Query("tiempo") long tiempo);

    }

    // inicia el contador de tiempo
    private void startTimer() {
        startTimeMillis = SystemClock.elapsedRealtime();
        handler.postDelayed(updateTimer, 0);
        isTimerRunning = true;
    }

    // actualiza el contador de tiempo
    private Runnable updateTimer = new Runnable() {
        @Override
        public void run() {
            long currentTimeMillis = SystemClock.elapsedRealtime();
            long elapsedTimeMillis = currentTimeMillis - startTimeMillis;

            // Actualizar TextView con el tiempo transcurrido
            textViewTempo.setText(formatTime(elapsedTimeMillis));

            handler.postDelayed(this, 1000);
        }
    };

    // Método para formatear el tiempo en formato hh:mm:ss
    private String formatTime(long millis) {
        int seconds = (int) (millis / 1000);
        int minutes = seconds / 60;
        int hours = minutes / 60;
        seconds %= 60;
        minutes %= 60;
        hours %= 24;
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }

    // Método para enviar el tiempo al servidor
    private void enviarTiempoAlServidor(long tiempo) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        ApiService apiService = retrofit.create(ApiService.class);

        // Llama al método definido en la interfaz para enviar el tiempo al servidor
        Call<Void> call = apiService.enviarTiempo(tiempo);

        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    // La solicitud fue exitosa, puedes realizar acciones adicionales si es necesario
                    Log.d("Envío de tiempo", "Tiempo enviado con éxito");
                } else {
                    // Manejar una respuesta no exitosa aquí
                    Log.e("HTTP Error", "Código de respuesta HTTP: " + response.code());
                    Toast.makeText(MainActivity.this, "Error al enviar tiempo", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                // Manejar errores de la solicitud aquí
                Log.e("Error de conexión", "Error al conectarse al servidor: " + t.getMessage());
                Toast.makeText(MainActivity.this, "Error de conexión", Toast.LENGTH_SHORT).show();
            }
        });
    }

}