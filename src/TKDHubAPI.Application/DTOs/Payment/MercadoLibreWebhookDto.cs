using System.Text.Json.Serialization;
using TKDHubAPI.Application.DTOs.Payment;

public class MercadoLibreWebhookDto
{
    [JsonPropertyName("action")]
    public string Action { get; set; }

    [JsonPropertyName("api_version")]
    public string ApiVersion { get; set; }

    [JsonPropertyName("data")]
    public DataDto Data { get; set; }

    [JsonPropertyName("date_created")]
    public DateTime DateCreated { get; set; }

    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("live_mode")]
    public bool LiveMode { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("user_id")]
    public long UserId { get; set; }
}