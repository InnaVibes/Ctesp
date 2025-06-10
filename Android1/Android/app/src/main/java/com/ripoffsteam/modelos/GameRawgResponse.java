package com.ripoffsteam.modelos;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class GameRawgResponse {
    @SerializedName("count")
    private int count;

    @SerializedName("next")
    private String next;

    @SerializedName("previous")
    private String previous;

    @SerializedName("results")
    private List<GameRawg> results;

    // Getters e Setters
    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getNext() {
        return next;
    }

    public void setNext(String next) {
        this.next = next;
    }

    public String getPrevious() {
        return previous;
    }

    public void setPrevious(String previous) {
        this.previous = previous;
    }

    public List<GameRawg> getResults() {
        return results;
    }

    public void setResults(List<GameRawg> results) {
        this.results = results;
    }
}