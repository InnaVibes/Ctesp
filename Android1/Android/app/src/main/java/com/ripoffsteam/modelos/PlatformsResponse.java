package com.ripoffsteam.modelos;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class PlatformsResponse {
    @SerializedName("count")
    private int count;

    @SerializedName("next")
    private String next;

    @SerializedName("previous")
    private String previous;

    @SerializedName("results")
    private List<Platform.PlatformDetail> results;

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

    public List<Platform.PlatformDetail> getResults() {
        return results;
    }

    public void setResults(List<Platform.PlatformDetail> results) {
        this.results = results;
    }
}