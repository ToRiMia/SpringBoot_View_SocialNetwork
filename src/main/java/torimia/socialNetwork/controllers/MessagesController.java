package torimia.socialNetwork.controllers;

import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import torimia.socialNetwork.domain.Message;
import torimia.socialNetwork.domain.Views;
import torimia.socialNetwork.repo.MessageRepo;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("message")
public class MessagesController {

    private final MessageRepo messageRepo;

    @Autowired
    public MessagesController(MessageRepo messageRepo) {
        this.messageRepo = messageRepo;
    }

    @GetMapping
    @JsonView(Views.IdName.class)
    public List<Message> getMessages() {
        return messageRepo.findAll();
    }

    @GetMapping("{id}")
    public Message getItemById(@PathVariable("id") Message message) {
        return message;
    }

    @PostMapping
    public Message create(@RequestBody Message newMessage) {
        newMessage.setCreationDate(LocalDateTime.now());
        return messageRepo.save(newMessage);
    }

    @PutMapping("{id}")
    public Message update(
            @PathVariable("id") Message messageFromDB,
            @RequestBody Message message) {

        BeanUtils.copyProperties(message, messageFromDB, "id", "creationDate");
        return messageRepo.save(messageFromDB);
    }

    @DeleteMapping("{id}")
    public void remove(@PathVariable("id") Message message) {
        messageRepo.delete(message);
    }
}
