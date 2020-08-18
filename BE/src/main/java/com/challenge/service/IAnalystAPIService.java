package com.challenge.service;

import com.google.gson.JsonObject;
import org.springframework.stereotype.Service;

/**
 *
 * @author Hung Hau
 */
@Service
public interface IAnalystAPIService {
    
    public JsonObject analyseData(String json) throws IllegalArgumentException;
}
