# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["ApprovalTask.API/ApprovalTask.API.csproj", "ApprovalTask.API/"]
COPY ["ApprovalTask.Core/ApprovalTask.Core.csproj", "ApprovalTask.Core/"]
COPY ["ApprovalTask.Infrastructure/ApprovalTask.Infrastructure.csproj", "ApprovalTask.Infrastructure/"]
RUN dotnet restore "ApprovalTask.API/ApprovalTask.API.csproj"

# Copy all source files and build
COPY . .
WORKDIR "/src/ApprovalTask.API"
RUN dotnet build "ApprovalTask.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "ApprovalTask.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Production runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:9002
EXPOSE 9002
ENTRYPOINT ["dotnet", "ApprovalTask.API.dll"]