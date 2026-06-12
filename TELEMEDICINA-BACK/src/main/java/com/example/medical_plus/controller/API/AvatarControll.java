package com.example.medical_plus.controller.API;

import com.example.medical_plus.model.Usuario;
import com.example.medical_plus.service.UsuarioService;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class AvatarControll {

    private final UsuarioService usuarioService;

    public AvatarControll(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/avatar")
    public AvatarResponse uploadAvatar(
            @RequestParam("avatar") MultipartFile avatar,
            HttpSession session
    ) throws IOException {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return new AvatarResponse(
                    false,
                    "Usuário não está logado",
                    null
            );
        }

        if (avatar.isEmpty()) {
            return new AvatarResponse(
                    false,
                    "Nenhum arquivo enviado",
                    null
            );
        }

        String contentType = avatar.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            return new AvatarResponse(
                    false,
                    "Arquivo precisa ser uma imagem",
                    null
            );
        }

        Path uploadDir = Paths.get("uploads", "avatars", String.valueOf(usuario.getId()));

        if (Files.exists(uploadDir)) {
            try (DirectoryStream<Path> files = Files.newDirectoryStream(uploadDir)) {
                for (Path file : files) {
                    if (Files.isRegularFile(file)) {
                        Files.deleteIfExists(file);
                    }
                }
            }
        } else {
            Files.createDirectories(uploadDir);
        }

        String originalFilename = avatar.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String currentAvatar = usuario.getFotoPerfil();

        int nextNumber = 0;

        if (currentAvatar != null && currentAvatar.contains("/")) {
            String currentFilename = currentAvatar.substring(currentAvatar.lastIndexOf("/") + 1);

            if (currentFilename.startsWith("avatar")) {
                String numberPart = currentFilename
                        .replace("avatar", "")
                        .replaceAll("\\.[^.]+$", "");

                if (!numberPart.isBlank()) {
                    try {
                        nextNumber = Integer.parseInt(numberPart) + 1;
                    } catch (NumberFormatException e) {
                        nextNumber = 1;
                    }
                } else {
                    nextNumber = 1;
                }
            }
        }

        String filename;

        if (nextNumber == 0) {
            filename = "avatar" + extension;
        } else {
            filename = "avatar" + nextNumber + extension;
        }

        Path filePath = uploadDir.resolve(filename);

        Files.copy(
            avatar.getInputStream(),
            filePath,
            StandardCopyOption.REPLACE_EXISTING
        );

        String avatarUrl = "/uploads/avatars/" + usuario.getId() + "/" + filename;

        usuario.setFotoPerfil(avatarUrl);
        usuarioService.salvar(usuario);

        session.setAttribute("usuario", usuario);

        return new AvatarResponse(
                true,
                "Foto de perfil atualizada com sucesso",
                avatarUrl
        );
    }

    public record AvatarResponse(
            boolean success,
            String message,
            String avatarUrl
    ) {}
}
