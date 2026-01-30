package org.studyeasy._9springreact.payload.auth.album;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PhotoViewDTO {

    private long id;

    private String name;

    private String description;
}
