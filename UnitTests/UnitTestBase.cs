using NUnit.Framework;

namespace UnitTests
{
    [TestFixture]
    [Category("Unit Test")]
    public class UnitTestBase
    {
        [SetUp]
        public virtual void SetUp()
        {
        }

        [TearDown]
        public virtual void TearDown()
        {
        }
    }
}
