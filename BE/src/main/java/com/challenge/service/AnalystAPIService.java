package com.challenge.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import org.springframework.stereotype.Service;

/**
 *
 * @author Hung Hau
 */
@Service
public class AnalystAPIService implements IAnalystAPIService {

    @Override
    public JsonObject analyseData(String json) throws IllegalArgumentException {
        JsonArray jsonArray = createJsonArray(json);
        JsonObject projectJsonObject = new JsonObject();
        for (JsonElement element : jsonArray) {
            //itemArray[0] -> project, itemArray[1] -> theme, itemArray[2] -> method
            String[] itemArray = element.getAsString().split("/");
            if (itemArray.length != 3) {
                throw new IllegalArgumentException("Json input is not valid");
            }
            //Check project name existed or not in projectJsonObject
            if (projectJsonObject.has(itemArray[0])) {
                JsonObject themeJsonObject = projectJsonObject.get(itemArray[0]).getAsJsonObject();
                updateThemeJsonObject(themeJsonObject, itemArray[1], itemArray[2]);
            } else {
                JsonObject themeJsonObject = createThemeJsonObject(itemArray[1], itemArray[2]);
                projectJsonObject.add(itemArray[0], themeJsonObject);
            }
        }
        return projectJsonObject;
    }
    
    private JsonArray createJsonArray(String json) {
        try {
            return new JsonParser().parse(json).getAsJsonArray();
        } catch (JsonSyntaxException ex) {
            throw new IllegalArgumentException("Json input is not valid");
        }
    }

    private void updateThemeJsonObject(JsonObject themeJsonObject, String theme, String method) {
        countUp(themeJsonObject);
        if (themeJsonObject.has(theme)) {
            JsonObject methodJsonObject = themeJsonObject.get(theme).getAsJsonObject();
            updateMethodJson(methodJsonObject, method);
        } else {
            themeJsonObject.add(theme, createMethodJsonObject(method));
        }
    }

    private JsonObject createThemeJsonObject(String theme, String method) {
        JsonObject themeJsonObject = new JsonObject();
        countUp(themeJsonObject);
        themeJsonObject.add(theme, createMethodJsonObject(method));
        return themeJsonObject;
    }

    private JsonObject createMethodJsonObject(String method) {
        JsonObject methodJsonObject = new JsonObject();
        countUp(methodJsonObject);
        methodJsonObject.addProperty(method, 1);
        return methodJsonObject;
    }

    private void updateMethodJson(JsonObject methodJsonObject, String method) {
        countUp(methodJsonObject);
        int currentNumberMethod = methodJsonObject.has(method)
                ? methodJsonObject.get(method).getAsInt()
                : 0;
        methodJsonObject.addProperty(method, currentNumberMethod + 1);
    }

    private void countUp(JsonObject jsonObject) {
        int currentCount = jsonObject.has("_count")
                ? jsonObject.get("_count").getAsInt()
                : 0;
        jsonObject.addProperty("_count", currentCount + 1);
    }
}
