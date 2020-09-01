import { IsString } from 'class-validator';

class CreateTagDto {
  @IsString()
  public content: string;

  @IsString()
  public title: string;
}

export default CreateTagDto;
