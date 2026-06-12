package com.example.medical_plus.service;

import com.example.medical_plus.model.Notifications;
import com.example.medical_plus.repository.NotificationsRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationsService {

    private final NotificationsRepository notificationsRepository;

    public NotificationsService(NotificationsRepository notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }

    public boolean hasUnreadNotifications(Long usuarioId) {
        return notificationsRepository.existsByUsuarioIdAndLidaFalse(usuarioId);
    }

    public long countUnreadNotifications(Long usuarioId) {
        return notificationsRepository.countByUsuarioIdAndLidaFalse(usuarioId);
    }

    public List<Notifications> listUserNotifications(Long usuarioId) {
        return notificationsRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId);
    }

    public List<Notifications> listUnreadNotifications(Long usuarioId) {
        return notificationsRepository.findByUsuarioIdAndLidaFalseOrderByCriadoEmDesc(usuarioId);
    }

    public Notifications createNotification(
            Long usuarioId,
            String tipo,
            String titulo,
            String mensagem,
            String rotaDestino
    ) {
        Notifications notification = new Notifications(
                usuarioId,
                tipo,
                titulo,
                mensagem,
                rotaDestino
        );

        return notificationsRepository.save(notification);
    }

    public void markAsRead(Long notificationId) {
        Notifications notification = notificationsRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));

        notification.setLida(true);

        notificationsRepository.save(notification);
    }

    public void markAllAsRead(Long usuarioId) {
        List<Notifications> unreadNotifications =
                notificationsRepository.findByUsuarioIdAndLidaFalseOrderByCriadoEmDesc(usuarioId);

        for (Notifications notification : unreadNotifications) {
            notification.setLida(true);
        }

        notificationsRepository.saveAll(unreadNotifications);
    }
}