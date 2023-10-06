package com.example.projecte0azapol;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface ApiService {
    @POST("getPreguntes")
    Call<List<Pregunta>> obtenerPreguntas();
    @POST("getPreguntes")
    Call<List<Respuesta>> obtenerRespuestas();
    @POST("enviarRespuestas")
    Call<Void> enviarTiempo(@Query("tiempo") long tiempo);
}
