using System.Text.Json.Serialization;

public class DataDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; }
}