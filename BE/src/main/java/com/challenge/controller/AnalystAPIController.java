package com.challenge.controller;

//<editor-fold defaultstate="collapsed" desc="IMPORT">
import com.challenge.service.IAnalystAPIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
//</editor-fold>

/**
 *
 * @author Hung Hau
 */
@RestController
public class AnalystAPIController {
    
    @Autowired
    private IAnalystAPIService analystAPIService;
    
    @PostMapping("/analyse")
    public ResponseEntity analyseData(@RequestParam String logs) {
        try {
            return ResponseEntity.ok(analystAPIService.analyseData(logs).toString());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    
}
