---
name: csharp-backend
description: >
  C#/.NET 8+ backend development patterns, ASP.NET Core, Entity Framework Core, and enterprise
  patterns. Use whenever writing C# code, designing .NET services, or reviewing C# patterns.
  Triggers on: C#, .NET, ASP.NET, Entity Framework, NuGet, .csproj, DI, or C# syntax.
---

# C# Backend Development Skill

## Official Documentation (ALWAYS check first)
- .NET Documentation: https://learn.microsoft.com/en-us/dotnet/
- ASP.NET Core: https://learn.microsoft.com/en-us/aspnet/core/
- EF Core: https://learn.microsoft.com/en-us/ef/core/
- C# Language Reference: https://learn.microsoft.com/en-us/dotnet/csharp/

## Project Structure

```
src/
  Api/                    # ASP.NET Core host (thin)
  Application/            # Business logic (no infra deps)
  Domain/                 # Entities, value objects, domain events
  Infrastructure/         # EF Core, external services, file system
tests/
  Unit/                   # Fast, isolated tests
  Integration/            # WebApplicationFactory-based tests
```

## Key Patterns

### Primary Constructors (.NET 8+)
```csharp
public sealed class OrderService(
    IOrderRepository orderRepository,
    ILogger<OrderService> logger) : IOrderService
{
    public async Task<Order> CreateAsync(CreateOrderRequest request, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(request);
        // ...
    }
}
```

### Configuration
```csharp
// Always use strongly-typed options
public sealed class DatabaseOptions
{
    public const string Section = "Database";
    public required string ConnectionString { get; init; }
    public int MaxRetryCount { get; init; } = 3;
}

// Register in Program.cs
builder.Services.Configure<DatabaseOptions>(
    builder.Configuration.GetSection(DatabaseOptions.Section));
```

### Middleware Order (critical)
```csharp
app.UseExceptionHandler();
app.UseHsts();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.MapControllers();
```

## EF Core Rules
- Use migrations, never manual DDL.
- Use `AsNoTracking()` for read-only queries.
- Use projections (`Select`) instead of loading full entities.
- Split queries for collections (`AsSplitQuery()`).
- Never expose DbContext outside Infrastructure project.

## Anti-Patterns
- Do NOT expose EF entities in API responses; always use DTOs
- Do NOT use `.Result` or `.Wait()` on async methods
- Do NOT put business logic in controllers
- Do NOT use static state; use DI for shared services
- Do NOT skip database migrations; no manual schema changes in production
