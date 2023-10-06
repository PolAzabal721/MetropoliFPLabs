package com.example.projecte0azapol;

import com.google.gson.annotations.SerializedName;

public class Respuesta {
    @SerializedName("id")
    private int id;
    @SerializedName("respuesta")
    private String respuesta;
    @SerializedName("correcta")
    private boolean correcta;
    @SerializedName("tiempo")
    private long tiempo;
    private String pregunta;

    public Respuesta(int id, String pregunta , String respuesta, long tiempo) {
        this.id = id;
        this.respuesta = respuesta;
        this.tiempo = tiempo;
        this.pregunta = pregunta;
    }


    public void setId(int id) {
        this.id = id;
    }

    public void setCorrecta(boolean correcta) {
        this.correcta = correcta;
    }

    public long getTiempo() {
        return tiempo;
    }

    public void setTiempo(long tiempo) {
        this.tiempo = tiempo;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public String getPregunta() {
        return pregunta;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }

    public int getId() {
        return id;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public boolean isCorrecta() {
        return correcta;
    }

}