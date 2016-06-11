namespace Courses.Repositories.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Courses",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        RoomNumber = c.String(nullable: false),
                        BuildingNumber = c.String(nullable: false),
                        TeacherId = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Teachers", t => t.TeacherId, cascadeDelete: true)
                .Index(t => t.TeacherId, name: "IX_Teacher_Id");
            
            CreateTable(
                "dbo.Students",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        BirthDate = c.DateTime(nullable: false),
                        GPA = c.Double(nullable: false),
                        GivenNames = c.String(nullable: false),
                        SurName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Teachers",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        GivenNames = c.String(nullable: false),
                        SurName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CourseStudents",
                c => new
                    {
                        CourseId = c.Guid(nullable: false),
                        StudentId = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.CourseId, t.StudentId })
                .ForeignKey("dbo.Courses", t => t.CourseId, cascadeDelete: true)
                .ForeignKey("dbo.Students", t => t.StudentId, cascadeDelete: true)
                .Index(t => t.CourseId, name: "IX_Course_Id")
                .Index(t => t.StudentId, name: "IX_Student_Id");
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Courses", "TeacherId", "dbo.Teachers");
            DropForeignKey("dbo.CourseStudents", "StudentId", "dbo.Students");
            DropForeignKey("dbo.CourseStudents", "CourseId", "dbo.Courses");
            DropIndex("dbo.CourseStudents", "IX_Student_Id");
            DropIndex("dbo.CourseStudents", "IX_Course_Id");
            DropIndex("dbo.Courses", "IX_Teacher_Id");
            DropTable("dbo.CourseStudents");
            DropTable("dbo.Teachers");
            DropTable("dbo.Students");
            DropTable("dbo.Courses");
        }
    }
}
