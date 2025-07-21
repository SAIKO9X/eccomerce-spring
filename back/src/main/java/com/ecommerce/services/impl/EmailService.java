package com.ecommerce.services.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {

  private final JavaMailSender javaMailSender;
  private final TemplateEngine templateEngine;

  public void sendOtpEmailWithTemplate(String userEmail, String otp) throws MessagingException {
    MimeMessage mimeMessage = javaMailSender.createMimeMessage();
    MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "UTF-8");

    // Prepara as variáveis para o template
    Context context = new Context();
    context.setVariable("otpCode", otp);
    context.setVariable("currentYear", LocalDateTime.now().getYear());

    // Processa o template HTML com as variáveis
    String htmlContent = templateEngine.process("otp-email-template", context);

    try {
      mimeMessageHelper.setTo(userEmail);
      mimeMessageHelper.setSubject("Seu Código de Verificação - Ecommerce");
      mimeMessageHelper.setText(htmlContent, true);
      javaMailSender.send(mimeMessage);
    } catch (MailException e) {
      System.out.println("error: " + e);
      throw new MailSendException("failed to send email");
    }
  }

  public void sendSellerVerificationEmail(String sellerEmail, String sellerName, String verificationLink) throws MessagingException {
    MimeMessage mimeMessage = javaMailSender.createMimeMessage();
    MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "UTF-8");

    Context context = new Context();
    context.setVariable("sellerName", sellerName);
    context.setVariable("verificationLink", verificationLink);
    context.setVariable("currentYear", LocalDateTime.now().getYear());

    String htmlContent = templateEngine.process("seller-verification-email", context);

    try {
      mimeMessageHelper.setTo(sellerEmail);
      mimeMessageHelper.setSubject("Verifique seu E-mail para Começar a Vender");
      mimeMessageHelper.setText(htmlContent, true);
      javaMailSender.send(mimeMessage);
    } catch (MailException e) {
      System.out.println("error: " + e);
      throw new MailSendException("failed to send email");
    }
  }
}