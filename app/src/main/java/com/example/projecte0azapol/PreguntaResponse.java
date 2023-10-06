package com.example.projecte0azapol;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class PreguntaResponse {

    @SerializedName("preguntas")
    private List<Pregunta> preguntas;

    public List<Pregunta> getPreguntas() {
        return preguntas;
    }

    public class Pregunta {
    }
}
