package org.studyeasy._9springreact.payload.auth.album;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PhotoDTO {

    private Long id;

    private String name;

    private String description;

    private String fileName;

    private String download_link;

}
