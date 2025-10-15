package com.ripoffsteam.modelos;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class GenresResponse {
    @SerializedName("count")
    private int count;

    @SerializedName("next")
    private String next;

    @SerializedName("previous")
    private String previous;

    @SerializedName("results")
    private List<Genre> results;

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

    public List<Genre> getResults() {
        return results;
    }

    public void setResults(List<Genre> results) {
        this.results = results;
    }
}