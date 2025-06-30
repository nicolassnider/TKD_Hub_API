using System.Text.Json.Serialization;
[ExcludeFromCodeCoverage]
public class DataDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; }
}