package com.example.blog_server.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl  {
 
      
    @Autowired 
    private JavaMailSender javaMailSender;
 
    @Value("${spring.mail.username}") 
    private String sender;

    public Boolean sendSimpleEmail(EmailDetails emailDetails){
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            System.out.println(sender);
            System.out.println(emailDetails);
            mailMessage.setFrom(sender);
            mailMessage.setTo(emailDetails.getRecipient());
            mailMessage.setText(emailDetails.getMsgBody());
            mailMessage.setSubject(emailDetails.getSubject());

            System.err.println(mailMessage);
            javaMailSender.send(mailMessage);
            System.out.println("successfullt mail sent");
            return true;
            
        } catch (Exception e) {
            System.out.println("failed "+e);
            return false;

        }
    }
 

}