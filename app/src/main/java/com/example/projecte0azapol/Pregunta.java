package com.example.projecte0azapol;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class Pregunta {
    @SerializedName("id")
    private int id;
    @SerializedName("pregunta")
    private String pregunta;
    @SerializedName("respuestas")
    private List<Respuesta> respuestas;
    @SerializedName("foto")
    private String foto;
    // Otros campos según sea necesario

    public int getId() {
        return id;
    }

    public String getPregunta() {
        return pregunta;
    }

    public List<Respuesta> getRespuestas() {
        return respuestas;
    }

    public String getFoto() {
        return foto;
    }
}