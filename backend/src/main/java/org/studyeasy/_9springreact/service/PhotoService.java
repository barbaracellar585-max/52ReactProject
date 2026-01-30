package org.studyeasy._9springreact.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.studyeasy._9springreact.model.Photo;
import org.studyeasy._9springreact.repository.PhotoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    public Photo save(Photo photo){
        return photoRepository.save(photo);
    }

    public Optional<Photo> findById(long id){
        return photoRepository.findById(id);
    }

    public List<Photo> findByAlbum_id(Long id){
        return photoRepository.findByAlbum_id(id);
    }

    public void delete(Photo photo) {
        photoRepository.delete(photo);
    }
}
