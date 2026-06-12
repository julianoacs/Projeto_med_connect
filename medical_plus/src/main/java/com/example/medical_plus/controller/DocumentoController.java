package com.example.medical_plus.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class DocumentoController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // VISUALIZAR no navegador (inline) — sem verificação de sessão para compatibilidade com Next.js
    @GetMapping("/uploads/view/{filename:.+}")
    public ResponseEntity<Resource> visualizar(@PathVariable String filename) {
        return servirArquivo(filename, false);
    }

    // DOWNLOAD
    @GetMapping("/uploads/download/{filename:.+}")
    public ResponseEntity<Resource> download(@PathVariable String filename) {
        return servirArquivo(filename, true);
    }

    private ResponseEntity<Resource> servirArquivo(String filename, boolean forceDownload) {
        try {
            Path caminho = Paths.get(uploadDir).toAbsolutePath().resolve(filename).normalize();
            Resource resource = new UrlResource(caminho.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = detectarContentType(filename);
            String disposition = forceDownload
                    ? "attachment; filename=\"" + filename + "\""
                    : "inline; filename=\"" + filename + "\"";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String detectarContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".pdf"))  return "application/pdf";
        if (lower.endsWith(".png"))  return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".gif"))  return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (lower.endsWith(".doc"))  return "application/msword";
        return "application/octet-stream";
    }
}
